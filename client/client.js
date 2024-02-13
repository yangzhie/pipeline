
const nearestSection = document.querySelector('.nearest-section')
const mapCentreLocationSection = document.querySelector('.map-centre-location-section')

let map;

async function initMap() {
    const { Map, Marker } = await google.maps.importLibrary("maps")

    map = new Map(document.getElementById("map"), {
        center: { lat: -37.827084195990295, lng: 144.95917320577624 },
        zoom: 13,
        minZoom: 9,
    });
    const center = map.getCenter();
    const lat = center.lat();
    const lng = center.lng();

    getWeather(lat, lng);

    // TO DISCUSS WITH DT
    // const url = `http://localhost:8080/?lat=${lat}&lng=${lng}`
    // let data = {
    //     lat: lat,
    //     lng: lng
    // } 
    // fetch(url)
    //     method: 'post',
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(data) // 
    // })
    //     .then(res => res.json())
    //     .then(data => console.log(data))

    const latitudeElem = document.createElement('p')
    const longitudeElem = document.createElement('p')
    latitudeElem.textContent = lat
    longitudeElem.textContent = lng
    mapCentreLocationSection.appendChild(latitudeElem)
    mapCentreLocationSection.appendChild(longitudeElem)

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBnshLusOeJGaS1zRnSGDZzibrjBrt6bDc`

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const currentAddress = data.results[0].formatted_address
            const addressElem = document.createElement('h2')
            addressElem.textContent = currentAddress
            mapCentreLocationSection.appendChild(addressElem)
        })

    return stationMarker();
}

function stationMarker() {
    const url = 'http://localhost:8080/api/stations/all'

    fetch(url)
        .then(res => res.json())
        .then(stations => {
            for (let i = 0; i < stations.length; i++) {
                let latitude = stations[i].latitude;
                let longitude = stations[i].longitude;
                let name = stations[i].name
                let address = stations[i].address

                const contentString =
                `<div id="content"><p><strong>${name}</strong></p><p>${address}</p></div>`

                let infoWindow = new google.maps.InfoWindow({
                    content: contentString,
                    ariaLabel: name,
                  });

                const marker = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    title: `${name}\n${address}`
                })

                // DEAL WITH TOGGLEBOUNCE LATER

                marker.addListener("click", () => {
                    // toggleBounce(marker)
                    infoWindow.open({
                        anchor: marker,
                        map,
                      });

                });

                map.addListener('click', () => {
                    if (infoWindow) infoWindow.close();
                });

                window.initMap = initMap;
            }
        })
}

function nearestStations() {
    const url = 'http://localhost:8080/api/stations/all'

    fetch(url)
        .then(res => res.json())
        .then(stations => {
            for (let i = 0; i < 10; i++) {
                let stationName = stations[i].name
                let stationAddress = stations[i].address
                let stationOwner = stations[i].owner

                let stationArticle = document.createElement('article')
                let stationNameElem = document.createElement('p')
                stationNameElem.textContent = stationName

                let stationAddressElem = document.createElement('p')
                stationAddressElem.textContent = stationAddress

                let stationOwnerElem = document.createElement('p') // logo 
                stationOwnerElem.textContent = stationOwner


                stationArticle.appendChild(stationOwnerElem)
                stationArticle.appendChild(stationNameElem)
                stationArticle.appendChild(stationAddressElem)
                nearestSection.appendChild(stationArticle)

            }
        })
}
nearestStations()

function getWeather(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=&units=metric&appid=347533d0e42725230e0bb151a7cb2eea`
    fetch(url)
        .then(openweatherRes => openweatherRes.json())
        .then(result => {
            const tempCelsius = result.current.temp.toFixed(2)

            let currentWeatherSection = document.querySelector('.current-weather-section')
            let currentWeatherElem = document.createElement('h2')

            currentWeatherElem.textContent = tempCelsius

            currentWeatherSection.appendChild(currentWeatherElem)

            let localTime = result.current.dt

            // let hours = new Date(localTime * 1000).getHours()
            // let minutes = new Date(localTime * 1000).getMinutes()
            // let seconds = new Date(localTime * 1000).getSeconds()

            let date = new Date(localTime * 1000).getDate()
            let month = new Date(localTime * 1000).getMonth() + 1
            let year = new Date(localTime * 1000).getFullYear()

            let currentDateElem = document.createElement('p')
            currentDateElem.textContent = `${date}/${month}/${year}`

            currentWeatherSection.appendChild(currentDateElem)

        })
}



// DEAL WITH TOGGLEBOUNCE LATER

// function toggleBounce() {
//     if (marker.getAnimation() !== null) {
//         marker.setAnimation(null);
//     } else {
//         marker.setAnimation(google.maps.Animation.BOUNCE);
//     }
// }


initMap();