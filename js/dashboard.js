let plot = (data) => {
    const ctxLine = document.getElementById("myChart");
    const ctxBar = document.getElementById("chart-bar");

    const datasetLine = {
        labels: data.hourly.time,
        datasets: [
            {
                label: "Temperatura semanal",
                data: data.hourly.temperature_2m,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    };
    const datasetBar = {
        labels: data.daily.time,
        datasets: [
            {
                label: "Indice UV",
                data: data.daily.uv_index_max,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: [
                    "rgb(75, 192, 192, 0.2)",
                    "rgb(75, 192, 192, 0.2)",
                    "rgb(75, 192, 192, 0.2)",
                    "rgb(75, 192, 192, 0.2)",
                    "rgb(75, 192, 192, 0.2)",
                    "rgb(75, 192, 192, 0.2)",
                    "rgb(75, 192, 192, 0.2)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                grid: {
                    display: true,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const configLine = {
        type: "line",
        data: datasetLine,
        options: options,
    };
    const configBar = {
        type: "bar",
        data: datasetBar,
        options: options,
    };

    const chartLine = new Chart(ctxLine, configLine);
    const chartBar = new Chart(ctxBar, configBar);
};

let load = (data) => {
    let timezone = data["timezone"];
    let elemtz = document.getElementById("timezone");
    elemtz.textContent = timezone;
    let current_weather = data["current_weather"];
    let tempRN = current_weather["temperature"];
    let elemTemp = document.getElementById("tempRN");
    elemTemp.textContent = tempRN.toString() + "°C";
    let elevation = data["elevation"];
    let elemElev = document.getElementById("elevation");
    elemElev.textContent = elevation.toString();
    plot(data);
};

let loadInocar = (inocar) => {
    let URL_proxy = "https://cors-anywhere.herokuapp.com/";
    let URL = URL_proxy + "https://www.inocar.mil.ec/mareas/consultan.php";
    let contenedor = document.getElementById("table-container");
    const parser = new DOMParser();
    if (inocar == null) {
        fetch(URL)
            .then((response) => response.text())
            .then((data) => {
                const xml = parser.parseFromString(data, "text/html");
                let contenedorMareas =
                    xml.getElementsByClassName("container-fluid")[0];
                contenedor.innerHTML = contenedorMareas.innerHTML;
                localStorage.setItem("inocar", data);
            })
            .catch(console.error);
    } else {
        const xmlLoaded = parser.parseFromString(inocar, "text/html");
        let contenedorMareas =
            xmlLoaded.getElementsByClassName("container-fluid")[0];
        contenedor.innerHTML = contenedorMareas.innerHTML;
    }
};

function refreshPage(){
    localStorage.clear()
    location.reload();
}

const refresh = document.getElementById("refresh");

refresh.addEventListener('click', refreshPage);

(async function () {
    let inocar = localStorage.getItem("inocar");
    let meteo = localStorage.getItem("meteo");
    if (meteo == null) {
        try {
            let weatherProm = await fetch(
                "https://api.open-meteo.com/v1/forecast?latitude=-2.15&longitude=-79.97&hourly=temperature_2m&daily=uv_index_max&current_weather=true&timezone=auto"
            );
            let weather = await weatherProm.json();
            load(weather);
            localStorage.setItem("meteo", JSON.stringify(weather));
        } catch (error) {
            console.log(error);
        }
    } else {
        load(JSON.parse(meteo));
    }
    loadInocar(inocar);
})();
