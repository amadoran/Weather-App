const getWeatherApi = async () => {
    let weatherProm = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-2.15&longitude=-79.97&hourly=temperature_2m,precipitation_probability&current_weather=true&timezone=auto')
    let weather = await weatherProm.json()
    let timezone = weather["timezone"]
    let elemtz = document.getElementById("timezone")
    elemtz.textContent = timezone
}

getWeatherApi()