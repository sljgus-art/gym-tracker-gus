function mostrarPantalla(tipo) {

    const contenido = document.getElementById("contenido");

    if(tipo === "rutina"){

        contenido.innerHTML = `
        <h2>Registrar Serie</h2>

        <input id="ejercicio" placeholder="Ejercicio">

        <input id="peso" type="number" placeholder="Peso (kg)">

        <input id="reps" type="number" placeholder="Repeticiones">

        <input id="rir" type="number" placeholder="RIR">

        <button class="btn" onclick="guardarSerie()">
            Guardar Serie
        </button>
        `;
    }

    if(tipo === "historial"){

        contenido.innerHTML = `
        <h2>Historial</h2>
        <div id="listaHistorial"></div>
        `;

        mostrarHistorial();
    }

    if(tipo === "estadisticas"){

        contenido.innerHTML = `
        <h2>Estadísticas</h2>

        <p>Total series registradas:</p>

        <h3>${obtenerSeries().length}</h3>
        `;
    }

    if(tipo === "peso"){

        contenido.innerHTML = `
        <h2>Peso Corporal</h2>

        <input id="pesoCorporal"
        type="number"
        placeholder="Peso actual">

        <button class="btn" onclick="guardarPeso()">
            Guardar
        </button>
        `;
    }
}

function obtenerSeries(){
    return JSON.parse(localStorage.getItem("series")) || [];
}

function guardarSerie(){

    const serie = {
        fecha:new Date().toLocaleDateString(),
        ejercicio:document.getElementById("ejercicio").value,
        peso:document.getElementById("peso").value,
        reps:document.getElementById("reps").value,
        rir:document.getElementById("rir").value
    };

    const series = obtenerSeries();

    series.push(serie);

    localStorage.setItem(
        "series",
        JSON.stringify(series)
    );

    alert("Serie guardada");
}

function mostrarHistorial(){

    const lista = document.getElementById("listaHistorial");

    const series = obtenerSeries();

    lista.innerHTML = series.reverse().map(s => `
        <p>
        ${s.fecha}<br>
        <b>${s.ejercicio}</b><br>
        ${s.peso} kg x ${s.reps}
        (RIR ${s.rir})
        </p>
        <hr>
    `).join("");
}

function guardarPeso(){

    const peso =
        document.getElementById(
            "pesoCorporal"
        ).value;

    localStorage.setItem(
        "pesoCorporal",
        peso
    );

    alert("Peso guardado");
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
        './service-worker.js'
    );
}
