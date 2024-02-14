const nearestSection = document.querySelector('.nearest-section')
const mapCentreLocationSection = document.querySelector('.map-centre-location-section')
const currentTimeSection = document.querySelector('.current-time-section')
const statsSection = document.querySelector('.stats-section')


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

getUserLocation()

async function initMap(coordinates) {
    const { Map, Marker } = await google.maps.importLibrary("maps")

    map = new Map(document.getElementById("map"), {
        center: { lat: coordinates.lat, lng: coordinates.lng}, 
        zoom: 13,
        minZoom: 9,
    });
    let center = map.getCenter();
    let lat = center.lat();
    let lng = center.lng();

    getWeather(lat, lng);

    const userIcon = {
        url: '/images/person.png',
        scaledSize: new google.maps.Size(40, 40)
    }

    const userMarker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map,
        icon: userIcon,
        draggable: true,
        animation: google.maps.Animation.DROP,
    })

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
                const icon = {
                    url: assignCustomMarker(stations[i]),
                    scaledSize: new google.maps.Size(30, 30)
                }

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


function getUserLocation() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
        
        const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        initMap(pos)
        },
        () => {
        console.log('location access denied')
        },
    )
    } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
    }
}
const url = `http://localhost:8080/api/stats`

function getStats() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let arrOfOwners = data.owners
            let totalOwners = data.totalOwners.total_owners
            let totalStations = data.totalStations.total_stations
            console.log(arrOfOwners)
            console.log(totalOwners)
            console.log(totalStations)
            const totalOwnersElem = document.createElement('h3')
            const totalStationsElem = document.createElement('h3')
            totalOwnersElem.textContent = `total owners: ${totalOwners}`
            totalStationsElem.textContent = `total stations: ${totalStations}`
            statsSection.appendChild(totalOwnersElem)
            statsSection.appendChild(totalStationsElem)
            const statsInfoTableElem = document.createElement('table')
            statsInfoTableElem.classList.add('stats-info-table')
            for (let i = 0; i < arrOfOwners.length; i++) {
                const tablerowElem = document.createElement('tr')
                const tabledata1Elem = document.createElement('td')
                const tabledata2Elem = document.createElement('td')
                tabledata1Elem.textContent = arrOfOwners[i].owner
                tabledata2Elem.textContent = arrOfOwners[i].total
                tablerowElem.appendChild(tabledata1Elem)
                tablerowElem.appendChild(tabledata2Elem)
                statsInfoTableElem.appendChild(tablerowElem)
            }
            statsSection.appendChild(statsInfoTableElem)
            
        })
}

getStats()
let sidebarsVisible = true 

document.addEventListener('keydown', function(event){
    console.log(event.key);
    if (event.ctrlKey && event.shiftKey && event.key.toUpperCase() === 'B')
    toggleSidebars()
})

function toggleSidebars() {
    const wrapper = document.querySelector('.wrapper')

    wrapper.classList.toggle('hide-sidebars', !sidebarsVisible)

    if (!sidebarsVisible) {
        wrapper.classList.remove('wrapper');
    } else {
        const newWrapper = document.createElement('div');
        newWrapper.classList.add('wrapper');
        document.body.appendChild(newWrapper);

    }
    sidebarsVisible = !sidebarsVisible;
    
}

toggleSidebars()
