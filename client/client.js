let map;
const url = `http://localhost:8080/api/stats`

const nearestSection = document.querySelector('.nearest-section')
const mapCentreLocationSection = document.querySelector('.map-centre-location-section')
const currentTimeSection = document.querySelector('.current-time-section')
const statsSection = document.querySelector('.stats-section')
const spotlightSection = document.querySelector('.spotlight-section')
const mapCentreAddressSection = document.querySelector('.map-centre-address-section')
const randomStationButton = document.querySelector(".random-station-btn")
const randomStationInfo = document.querySelector(".random-station-info")
const darkModeToggle = document.getElementById('darkModeToggle')


randomStationButton.addEventListener("click", getRandomPetrolStation)
document.addEventListener('keydown', function (event) {
    console.log(event.key);
    if (event.ctrlKey && event.shiftKey && event.key.toUpperCase() === 'B')
        toggleSidebars()
})

const body = document.body;
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode')
})

setInterval(() => {
    showTime()
}, 1000);

const customMarkers = {
    SevenEleven: '/images/7-eleven-logo.png',
    BP: '/images/bp-logo.png',
    Caltex: '/images/caltex-logo.png',
    Shell: '/images/shell-logo.png',
    United: '/images/united-logo.jpg',
    Ampol: '/images/ampol-logo.png',
    Other: '/images/generic-logo.png',
}

getUserLocation()

async function initMap(coordinates) {
    const { Map, Marker } = await google.maps.importLibrary("maps")

    map = new Map(document.getElementById("map"), {
        center: { lat: coordinates.lat, lng: coordinates.lng },
        zoom: 13,
        minZoom: 9,
    });

    map.addListener("bounds_changed", handleMapBounds)

    let center = map.getCenter();
    let lat = center.lat();
    let lng = center.lng();

    getWeather(lat, lng);

    const userIcon = {
        url: '/images/person.png',
        scaledSize: new google.maps.Size(40, 40)
    }

    let userMarker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map,
        icon: userIcon,
        draggable: true,
        animation: google.maps.Animation.DROP,
    })

    // map.addListener('dragend', () => {
    //     const newCenter = map.getCenter()
    //     const lat = newCenter.lat()
    //     const lng = newCenter.lng()

    //     latitudeElem.textContent = `Latitude: ${lat}`
    //     longitudeElem.textContent = `Longitude: ${lng}`

    //     if (userMarker) {
    //         userMarker.setMap(null);
    //     }

    //     userMarker = new google.maps.Marker({
    //         position: { lat: lat, lng: lng },
    //         map,
    //         icon: userIcon,
    //         draggable: true,
    //         animation: google.maps.Animation.DROP,
    //     });

    //     showCentreAddress(lat, lng)
    // })

    const latitudeElem = document.createElement('p')
    const longitudeElem = document.createElement('p')
    latitudeElem.textContent = `Latitude: ${lat}`
    longitudeElem.textContent = `Longitude: ${lng}`
    mapCentreLocationSection.appendChild(latitudeElem)
    mapCentreLocationSection.appendChild(longitudeElem)

    showCentreAddress(lat, lng)

    return stationMarker();
}

function showCentreAddress(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBnshLusOeJGaS1zRnSGDZzibrjBrt6bDc`
    mapCentreAddressSection.innerHTML = ''

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const currentAddress = data.results[0].formatted_address
            const addressElem = document.createElement('h4')
            addressElem.textContent = currentAddress
            mapCentreAddressSection.appendChild(addressElem)
            mapCentreLocationSection.appendChild(mapCentreAddressSection)
        })
    findNearestStations(lat, lng, 5000)
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

                marker.addListener("click", () => {
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

function getWeather(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=&units=metric&appid=3ce6928b55a1caf2d1a519d7abcd4e76`
    fetch(url)
        .then(openweatherRes => openweatherRes.json())
        .then(result => {
            const tempCelsius = result.current.temp.toFixed(2)
            let currentWeatherSection = document.querySelector('.current-weather-section')
            let currentWeatherElem = document.createElement('h2')

            currentWeatherElem.textContent = tempCelsius

            currentWeatherSection.appendChild(currentWeatherElem)

            let localTime = result.current.dt

            let date = new Date(localTime * 1000).getDate()
            let month = new Date(localTime * 1000).getMonth() + 1
            let year = new Date(localTime * 1000).getFullYear()

            let currentDateElem = document.createElement('p')
            currentDateElem.textContent = `${date}/${month}/${year}`

            currentWeatherSection.appendChild(currentDateElem)

        })
}

function assignCustomMarker(servo) {
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

function showTime() {
    currentTimeSection.innerHTML = ''
    let currentTime = moment().format("ddd hh:mm:ss a")
    const showTimeElem = document.createElement('h2')
    showTimeElem.textContent = currentTime
    currentTimeSection.appendChild(showTimeElem)
}

function getRandomPetrolStation() {
    const url = 'http://localhost:8080/api/stations/random'
    randomStationInfo.innerHTML = ''

    fetch(url)
        .then(res => res.json())
        .then(station => {

            const randomServoElem = document.createElement('div')
            randomServoElem.classList.add('random-servo-div')
            const nameElem = document.createElement('h3')
            const addressElem = document.createElement('p')

            nameElem.textContent = station.name
            addressElem.textContent = station.address

            const imageElem = document.createElement('img')
            imageElem.src = assignCustomMarker(station)

            randomServoElem.appendChild(nameElem)
            randomServoElem.appendChild(addressElem)
            randomStationInfo.appendChild(imageElem)
            randomStationInfo.appendChild(randomServoElem)

        })
}
getRandomPetrolStation()

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

function getStats() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let arrOfOwners = data.owners
            let totalOwners = data.totalOwners.total_owners
            let totalStations = data.totalStations.total_stations
            const totalOwnersElem = document.createElement('h3')
            const totalStationsElem = document.createElement('h3')
            totalOwnersElem.textContent = `Total owners: ${totalOwners}`
            totalStationsElem.textContent = `Total stations: ${totalStations}`
            statsSection.appendChild(totalOwnersElem)
            statsSection.appendChild(totalStationsElem)
            const statsInfoTableElem = document.createElement('table')
            statsInfoTableElem.classList.add('stats-info-table')
            for (let i = 0; i < arrOfOwners.length; i++) {
                const tablerowElem = document.createElement('tr')
                const tabledata1Elem = document.createElement('td')
                const tabledata2Elem = document.createElement('td')
                tabledata2Elem.classList.add('owners-count-cell')
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
function toggleSidebars() {
    const wrapper = document.querySelector('.wrapper')

    wrapper.classList.toggle('hide-sidebars', !sidebarsVisible)

    if (!sidebarsVisible) {
        wrapper.classList.add('wrapper-full');
    } else {
        wrapper.classList.remove('wrapper-full');

    }
    sidebarsVisible = !sidebarsVisible;

}

function handleMapBounds() {
    let bounds = map.getBounds()
    let boundsCoordinates = {
        maxLat: bounds.getNorthEast().lat(),
        maxLng: bounds.getNorthEast().lng(),
        minLat: bounds.getSouthWest().lat(),
        minLng: bounds.getSouthWest().lng()
    }
    // return boundsCoordinates
    getInBoundStations(boundsCoordinates)
}

function toQueryString(obj) {
    let paramsArr = Object.entries(obj)
        .map(params => params.join('='))
    return `?${paramsArr.join('&')}`
}

function getInBoundStations(coordinates) {
    const queryStr = toQueryString(coordinates)
    const stationsUrl = `http://localhost:8080/api/stations/bounds/${queryStr}`
    fetch(stationsUrl)
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
                    draggable: false,
                    // animation: google.maps.Animation.DROP,
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

function findNearestStations(lat, lng, radius) {

    const queryStr = `http://localhost:8080/api/stations/nearest/?lat=${lat}&lng=${lng}&radius=${radius}`

    fetch(queryStr)
        .then(res => res.json())
        .then(stations => {
            for (let i = 0; i < 10; i++) {
                let stationName = stations[i].name
                let stationAddress = stations[i].address
                let distance = (stations[i].distance * 1.61).toFixed(2)

                let stationArticle = document.createElement('article')
                stationArticle.classList.add('nearest-station-article')
                let descriptionElem = document.createElement('div')
                let stationNameElem = document.createElement('p')
                stationNameElem.textContent = stationName
                stationNameElem.classList.add('owner-p')

                let stationAddressElem = document.createElement('p')
                stationAddressElem.textContent = stationAddress

                let distanceElem = document.createElement('span')
                distanceElem.classList.add('distance-span')
                distanceElem.textContent = `${distance}km`
                let stationOwnerElem = document.createElement('img') // logo
                stationOwnerElem.classList.add('marker')
                stationOwnerElem.src = assignCustomMarker(stations[i])

                stationNameElem.appendChild(distanceElem)
                stationArticle.appendChild(stationOwnerElem)
                descriptionElem.appendChild(stationNameElem)
                descriptionElem.appendChild(stationAddressElem)
                stationArticle.appendChild(descriptionElem)
                nearestSection.appendChild(stationArticle)
            }
        })
}