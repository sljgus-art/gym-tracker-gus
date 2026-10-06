function mostrarPantalla(tipo) {

    const contenido = document.getElementById("contenido");

    if (tipo === "rutina") {

        contenido.innerHTML = `
            <h2>💪 Registrar Serie</h2>

            <label>Categoría</label>

            <select id="categoria" onchange="actualizarEjercicios()">
            </select>

            <label>Ejercicio</label>

            <select id="ejercicio">
            </select>

            <input id="peso" type="number" placeholder="Peso (kg)">

            <input id="reps" type="number" placeholder="Repeticiones">

            <input id="rir" type="number" placeholder="RIR">

            <button class="btn" onclick="guardarSerie()">
                Guardar Serie
            </button>
        `;

        cargarCategorias();
    }

    if (tipo === "historial") {

        contenido.innerHTML = `
            <h2>📅 Historial</h2>
            <div id="listaHistorial"></div>
        `;

        mostrarHistorial();
    }

    if (tipo === "estadisticas") {

        const series = obtenerSeries();

        const ejerciciosUnicos = [
            ...new Set(series.map(s => s.ejercicio))
        ];

        contenido.innerHTML = `
            <h2>📈 Estadísticas</h2>

            <div class="stat-card">
                <p>Total series registradas</p>
                <div class="stat-number">${series.length}</div>
            </div>

            <div class="stat-card">
                <p>Ejercicios diferentes</p>
                <div class="stat-number">${ejerciciosUnicos.length}</div>
            </div>
        `;
    }

    if (tipo === "peso") {

        const ultimoPeso =
            localStorage.getItem("pesoCorporal") || "";

        contenido.innerHTML = `
            <h2>⚖️ Peso Corporal</h2>

            <input
                id="pesoCorporal"
                type="number"
                step="0.1"
                placeholder="Peso actual"
                value="${ultimoPeso}"
            >

            <button class="btn" onclick="guardarPeso()">
                Guardar Peso
            </button>
        `;
    }
}

function obtenerSeries() {
    return JSON.parse(
        localStorage.getItem("series")
    ) || [];
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
        document.getElementById("peso").value;

    const reps =
        document.getElementById("reps").value;

    const rir =
        document.getElementById("rir").value;

    if (!peso || !reps) {

        alert(
            "Completa peso y repeticiones."
        );

        return;
    }

    const serie = {
        fecha: new Date().toLocaleDateString("es-ES"),
        categoria: categoria,
        ejercicio: ejercicio,
        peso: Number(peso),
        reps: Number(reps),
        rir: rir ? Number(rir) : ""
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
        document.getElementById(
            "listaHistorial"
        );

    const series =
        [...obtenerSeries()].reverse();

    if (series.length === 0) {

        lista.innerHTML = `
            <p>No hay entrenamientos registrados.</p>
        `;

        return;
    }

    lista.innerHTML = series.map(s => `
        <div class="historial-item">

            <strong>${s.ejercicio}</strong><br>

            <small>${s.categoria}</small><br>

            ${s.fecha}<br>

            ${s.peso} kg × ${s.reps}

            ${s.rir !== ""
                ? `(RIR ${s.rir})`
                : ""
            }

        </div>
    `).join("");
}

function guardarPeso() {

    const peso =
        document.getElementById(
            "pesoCorporal"
        ).value;

    if (!peso) {

        alert("Introduce un peso.");

        return;
    }

    localStorage.setItem(
        "pesoCorporal",
        peso
    );

    actualizarResumen();

    alert("✅ Peso guardado");
}

function actualizarResumen() {

    const totalSeries =
        document.getElementById(
            "totalSeries"
        );

    if (!totalSeries) return;

    const series =
        obtenerSeries();

    const ejerciciosUnicos =
        [...new Set(
            series.map(
                s => s.ejercicio
            )
        )];

    const pesoActual =
        document.getElementById(
            "pesoActual"
        );

    const totalEjercicios =
        document.getElementById(
            "totalEjercicios"
        );

    const ultimoEntreno =
        document.getElementById(
            "ultimoEntreno"
        );

    totalSeries.textContent =
        series.length;

    totalEjercicios.textContent =
        ejerciciosUnicos.length;

    pesoActual.textContent =
        localStorage.getItem(
            "pesoCorporal"
        ) || "--";

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

document.addEventListener(
    "DOMContentLoaded",
    actualizarResumen
);

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {
                console.log(
                    "✅ Service Worker registrado"
                );
            })
            .catch(error => {
                console.error(
                    "Error Service Worker:",
                    error
                );
            });

    });

}
