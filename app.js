function obtenerSeries() {
    return JSON.parse(localStorage.getItem("series")) || [];
}

function mostrarPantalla(tipo) {

    const contenido = document.getElementById("contenido");

    // ENTRENAR
    if (tipo === "rutina") {

        contenido.innerHTML = `
            <h2>💪 Registrar Serie</h2>

            <label>Categoría</label>
            <select id="categoria" onchange="actualizarEjercicios()"></select>

            <label>Ejercicio</label>
            <select id="ejercicio"></select>

            <input id="peso" type="number" placeholder="Peso (kg)">
            <input id="reps" type="number" placeholder="Repeticiones">
            <input id="rir" type="number" placeholder="RIR">

            <button class="btn" onclick="guardarSerie()">
                Guardar Serie
            </button>
        `;

        cargarCategorias();
    }

    // HISTORIAL
    if (tipo === "historial") {

        contenido.innerHTML = `
            <h2>📅 Historial</h2>
            <div id="listaHistorial"></div>
        `;

        mostrarHistorial();
    }

    // ESTADÍSTICAS
    if (tipo === "estadisticas") {

        const series = obtenerSeries();

        const ejerciciosUnicos = [
            ...new Set(series.map(s => s.ejercicio))
        ];

        const volumenTotal = series.reduce(
            (total, s) => total + (s.peso * s.reps),
            0
        );

        contenido.innerHTML = `
            <h2>📈 Estadísticas</h2>

            <div class="stat-card">
                <p>Total series</p>
                <div class="stat-number">
                    ${series.length}
                </div>
            </div>

            <div class="stat-card">
                <p>Ejercicios distintos</p>
                <div class="stat-number">
                    ${ejerciciosUnicos.length}
                </div>
            </div>

            <div class="stat-card">
                <p>Volumen total</p>
                <div class="stat-number">
                    ${Math.round(volumenTotal)}
                </div>
            </div>
        `;
    }

    // PESO CORPORAL
    if (tipo === "peso") {

        const ultimoPeso =
            localStorage.getItem("pesoCorporal") || "";

        contenido.innerHTML = `
            <h2>⚖️ Peso corporal</h2>

            <input
                id="pesoCorporal"
                type="number"
                step="0.1"
                value="${ultimoPeso}"
                placeholder="Peso actual"
            >

            <button class="btn" onclick="guardarPeso()">
                Guardar peso
            </button>
        `;
    }

    // PRS
    if (tipo === "prs") {

        const prs = calcularPRs();

        contenido.innerHTML =
            `<h2>🏆 Récords personales</h2>`;

        Object.keys(prs).forEach(ejercicio => {

            contenido.innerHTML += `
                <div class="historial-item">
                    <strong>${ejercicio}</strong><br>
                    ${prs[ejercicio].peso} kg × ${prs[ejercicio].reps}
                </div>
            `;
        });
    }

    // BACKUP
    if (tipo === "backup") {

        contenido.innerHTML = `
            <h2>💾 Copia de seguridad</h2>

            <button class="btn" onclick="exportarDatos()">
                Exportar Backup
            </button>

            <br><br>

            <input
                type="file"
                accept=".json"
                onchange="importarDatos(event)"
            >
        `;
    }

    // RUTINAS
    if (tipo === "rutinas") {

        contenido.innerHTML = `
            <h2>📋 Rutinas</h2>
        `;

        Object.keys(RUTINAS).forEach(rutina => {

            contenido.innerHTML += `
                <div class="historial-item">

                    <strong>${rutina}</strong>

                    <br><br>

                    ${RUTINAS[rutina].join("<br>")}

                </div>
            `;
        });
    }

    // PROGRESO
    if (tipo === "progreso") {

        const series = obtenerSeries();

        const volumenTotal = series.reduce(
            (total, serie) =>
                total + (serie.peso * serie.reps),
            0
        );

        const prs = calcularPRs();

        contenido.innerHTML = `
            <h2>📊 Progreso</h2>

            <div class="stat-card">
                <p>Volumen acumulado</p>
                <div class="stat-number">
                    ${Math.round(volumenTotal)}
                </div>
            </div>

            <div class="stat-card">
                <p>PRs registrados</p>
                <div class="stat-number">
                    ${Object.keys(prs).length}
                </div>
            </div>

            <div class="stat-card">
                <p>Entrenamientos registrados</p>
                <div class="stat-number">
                    ${series.length}
                </div>
            </div>
        `;
    }
}

function cargarCategorias() {

    const categoriaSelect =
        document.getElementById("categoria");

    categoriaSelect.innerHTML = Object.keys(EJERCICIOS)
        .map(categoria =>
            `<option value="${categoria}">
                ${categoria}
            </option>`
        )
        .join("");

    actualizarEjercicios();
}

function actualizarEjercicios() {

    const categoria =
        document.getElementById("categoria").value;

    const ejercicioSelect =
        document.getElementById("ejercicio");

    ejercicioSelect.innerHTML =
        EJERCICIOS[categoria]
            .map(ejercicio =>
                `<option value="${ejercicio}">
                    ${ejercicio}
                </option>`
            )
            .join("");
}

function guardarSerie() {

    const categoria =
        document.getElementById("categoria").value;

    const ejercicio =
        document.getElementById("ejercicio").value;

    const peso =
        Number(document.getElementById("peso").value);

    const reps =
        Number(document.getElementById("reps").value);

    const rir =
        document.getElementById("rir").value;

    if (!peso || !reps) {

        alert("Completa peso y repeticiones");

        return;
    }

    const serie = {
        fecha: new Date().toLocaleDateString("es-ES"),
        categoria,
        ejercicio,
        peso,
        reps,
        rir
    };

    const series = obtenerSeries();

    series.push(serie);

    localStorage.setItem(
        "series",
        JSON.stringify(series)
    );

    actualizarResumen();

    alert("✅ Serie guardada");

    document.getElementById("peso").value = "";
    document.getElementById("reps").value = "";
    document.getElementById("rir").value = "";
}

function mostrarHistorial() {

    const lista =
        document.getElementById("listaHistorial");

    const series =
        [...obtenerSeries()].reverse();

    if (series.length === 0) {

        lista.innerHTML =
            "<p>No hay registros.</p>";

        return;
    }

    lista.innerHTML = series.map(s => `
        <div class="historial-item">

            <strong>${s.ejercicio}</strong>

            <br>

            <small>${s.categoria}</small>

            <br>

            ${s.fecha}

            <br>

            ${s.peso} kg × ${s.reps}

            ${s.rir ? `(RIR ${s.rir})` : ""}

        </div>
    `).join("");
}

function guardarPeso() {

    const peso =
        document.getElementById("pesoCorporal").value;

    if (!peso) return;

    localStorage.setItem(
        "pesoCorporal",
        peso
    );

    actualizarResumen();

    alert("✅ Peso guardado");
}

function calcularPRs() {

    const prs = {};

    obtenerSeries().forEach(serie => {

        const score =
            serie.peso * serie.reps;

        if (
            !prs[serie.ejercicio] ||
            score > prs[serie.ejercicio].score
        ) {

            prs[serie.ejercicio] = {
                peso: serie.peso,
                reps: serie.reps,
                score: score
            };
        }
    });

    return prs;
}

function actualizarResumen() {

    const totalSeries =
        document.getElementById("totalSeries");

    if (!totalSeries) return;

    const series = obtenerSeries();

    const ejercicios =
        [...new Set(
            series.map(s => s.ejercicio)
        )];

    document.getElementById("totalSeries").textContent =
        series.length;

    document.getElementById("totalEjercicios").textContent =
        ejercicios.length;

    document.getElementById("pesoActual").textContent =
        localStorage.getItem("pesoCorporal") || "--";

    const ultimoEntreno =
        document.getElementById("ultimoEntreno");

    if (series.length > 0) {

        const ultimo =
            series[series.length - 1];

        ultimoEntreno.innerHTML = `
            ${ultimo.ejercicio}<br>
            ${ultimo.peso} kg × ${ultimo.reps}
        `;

    } else {

        ultimoEntreno.textContent =
            "Sin registros";
    }
}

function exportarDatos() {

    const datos = {
        series: obtenerSeries(),
        peso: localStorage.getItem("pesoCorporal")
    };

    const blob = new Blob(
        [JSON.stringify(datos)],
        {
            type: "application/json"
        }
    );

    const enlace =
        document.createElement("a");

    enlace.href =
        URL.createObjectURL(blob);

    enlace.download =
        "gym-tracker-backup.json";

    enlace.click();
}

function importarDatos(event) {

    const archivo =
        event.target.files[0];

    if (!archivo) return;

    const lector =
        new FileReader();

    lector.onload = e => {

        const datos =
            JSON.parse(e.target.result);

        localStorage.setItem(
            "series",
            JSON.stringify(datos.series || [])
        );

        localStorage.setItem(
            "pesoCorporal",
            datos.peso || ""
        );

        actualizarResumen();

        alert("✅ Backup restaurado");
    };

    lector.readAsText(archivo);
}

document.addEventListener(
    "DOMContentLoaded",
    actualizarResumen
);

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js");

    });
}
