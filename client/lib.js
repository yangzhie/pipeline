let map;

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

    const userMarker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map,
        icon: userIcon,
        draggable: true,
        animation: google.maps.Animation.DROP,
    })

    const latitudeElem = document.createElement('p')
    const longitudeElem = document.createElement('p')
    latitudeElem.textContent = `Latitude: ${lat}`
    longitudeElem.textContent = `Longitude: ${lng}`
    mapCentreLocationSection.appendChild(latitudeElem)
    mapCentreLocationSection.appendChild(longitudeElem)

    showCentreAddress(lat, lng)

    return stationMarker();
}
