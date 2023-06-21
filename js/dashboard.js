let plot = (data) => {
    const ctxLine = document.getElementById("myChart")
    const ctxBar = document.getElementById("chart-bar")

    const datasetLine = {
        labels: data.hourly.time,
        datasets: [{
            label: 'Temperatura semanal',
            data: data.hourly.temperature_2m,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }
    const datasetBar = {
        labels: data.daily.time,
        datasets: [{
            label: 'Indice UV',
            data: data.daily.uv_index_max,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: [
                'rgb(75, 192, 192, 0.2)',
                'rgb(75, 192, 192, 0.2)',
                'rgb(75, 192, 192, 0.2)',
                'rgb(75, 192, 192, 0.2)',
                'rgb(75, 192, 192, 0.2)',
                'rgb(75, 192, 192, 0.2)',
                'rgb(75, 192, 192, 0.2)'
            ],
            borderWidth: 1
        }]
    }

    const configLine = {
        type: 'line',
        data: datasetLine
    }
    const configBar = {
        type: 'bar',
        data: datasetBar
    }

    const chartLine = new Chart(ctxLine, configLine)
    const chartBar = new Chart(ctxBar, configBar)
}

let load = (data) => {
    let timezone = data["timezone"]
    let elemtz = document.getElementById("timezone")
    elemtz.textContent = timezone
    plot(data)
}

let loadInocar = (inocar) =>{
    let URL_proxy = 'http://localhost:8080/'
    let URL = URL_proxy + 'https://www.inocar.mil.ec/mareas/consultan.php' 
    let contenedor = document.getElementById('table-container')
    const parser = new DOMParser()
    if(inocar == null){
        fetch(URL)
        .then(response => response.text())
        .then(data => {
            const xml = parser.parseFromString(data, "text/html")
            let contenedorMareas = xml.getElementsByClassName('container-fluid')[0]
            contenedor.innerHTML = contenedorMareas.innerHTML
            localStorage.setItem("inocar", data)
        })
        .catch(console.error)
    } else{
        const xmlLoaded = parser.parseFromString(inocar, "text/html")
        let contenedorMareas = xmlLoaded.getElementsByClassName('container-fluid')[0]
        contenedor.innerHTML = contenedorMareas.innerHTML
    }
    
}

let meteo = localStorage.getItem("meteo");
let inocar = localStorage.getItem("inocar");

(
    async function(){
        if (meteo == null){
            let weatherProm = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-2.15&longitude=-79.97&hourly=temperature_2m&daily=uv_index_max&current_weather=true&timezone=auto')
            let weather = await weatherProm.json()
            load(weather)
            localStorage.setItem('meteo', JSON.stringify(weather))
        } else{
            load(JSON.parse(meteo))
        }
        loadInocar(inocar)
    }
)();
