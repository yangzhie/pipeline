const nearestSection = document.querySelector('.nearest-section')
const mapCentreLocationSection = document.querySelector('.map-centre-location-section')
const currentTimeSection = document.querySelector('.current-time-section')

const customMarkers = {
    SevenEleven: '/images/7-eleven-logo.png',
    BP: '/images/bp-logo.png',
    Caltex: '/images/caltex-logo.png',
    Shell: '/images/shell-logo.png',
    United: '/images/united-logo.jpg',
    Ampol: '/images/ampol-logo.png',
    Other: '/images/generic-logo.png',
}


let map;

async function initMap() {
    const { Map, Marker } = await google.maps.importLibrary("maps")

    map = new Map(document.getElementById("map"), {
        center: { lat: -37.827084195990295, lng: 144.95917320577624 },
        zoom: 13,
        minZoom: 9,
    });
    let center = map.getCenter();
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
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };


            const userMarker = new google.maps.Marker({
                position: { lat: pos.lat, lng: pos.lng },
                map,
                draggable: true,
                animation: google.maps.Animation.DROP,
            })
            map.setCenter(pos);
          },
          () => {
            console.log('location access denied')
          },
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }

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
<<<<<<< Updated upstream
                    `<div id="content"><p><strong>${name}</strong></p><p>${address}</p></div>`
=======
                `<div id="content"><p><strong>${name}</strong></p><p>${address}</p></div>`
                const icon = {
                    url: assignCustomMarker(stations[i]),
                    scaledSize: new google.maps.Size(30, 30)
                }
>>>>>>> Stashed changes

                let infoWindow = new google.maps.InfoWindow({
                    content: contentString,
                    ariaLabel: name,
                });

                const marker = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map,
                    icon: icon,
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

                let stationOwnerElem = document.createElement('img') // logo
                stationOwnerElem.classList.add('marker')
                stationOwnerElem.src = assignCustomMarker(stations[i])


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

<<<<<<< Updated upstream
function assignCustomMarker (servo) {
    let markerUrl = ''
    if (servo.owner.includes('7-Eleven')) {
        markerUrl = customMarkers.SevenEleven
    } else if (servo.owner.includes('BP')) {
        markerUrl = customMarkers.BP
    } else if (servo.owner.includes('Caltex')) {
        markerUrl = customMarkers.Caltex
    } else if (servo.owner.includes('Shell')) {
        markerUrl = customMarkers.Shell
    } else if (servo.owner.includes('United')) {
        markerUrl = customMarkers.United
    } else if (servo.owner.includes('Ampol')) {
        markerUrl = customMarkers.Ampol
    } else {
        markerUrl = customMarkers.Other
    }
    return markerUrl
}



=======
>>>>>>> Stashed changes
// DEAL WITH TOGGLEBOUNCE LATER

// function toggleBounce() {
//     if (marker.getAnimation() !== null) {
//         marker.setAnimation(null);
//     } else {
//         marker.setAnimation(google.maps.Animation.BOUNCE);
//     }
// }

function showTime() {
    currentTimeSection.innerHTML =''
    let currentTime = moment().format("ddd hh:mm:ss a")
    const showTimeElem = document.createElement('h2')
    showTimeElem.textContent = currentTime
    currentTimeSection.appendChild(showTimeElem)
}

setInterval(() => {
    showTime()
}, 1000);

initMap();




const randomStationButton = document.querySelector("#random-station-btn");

randomStationButton.addEventListener("click", function () {
    getRandomPetrolStation();
});

function getRandomPetrolStation() {
    const url = 'http://localhost:8080/api/stations/random';

    fetch(url)
        .then(res => res.json())
        .then(station => {
            alert(`Random Petrol Station:\nName: ${station.name}\nAddress: ${station.address}`);
        })
}