// Render loading spinner
export const loading = function(el) {

    const markup = `
        <div class="spinner">Loading...</div>
    `;

    el.innerHTML = markup;
}

// Render error message
export const errorMessage = function(error, el) {
    const message = error?.message ?? error;
    el.innerHTML = `${message}`;
}

// Render invalid output 
export const invalidInput = (error, el) =>
    error 
    ? el.style.border = '1px solid red'    
    : el.style.border = '';    

// Render geodata
export const geoData = function(data, el) {
    const {ip, isp, location: {city, region, postalCode, timezone}} = data;

    const markup = `
        <ul class="geolocation__list">
            <li class="geolocation__list-item">
                <h3 class="list-item__title">IP Address</h3>
                <p class="list-item__data">${ip}</p>
            </li>
            <li class="geolocation__list-item">
                <h3 class="list-item__title">Location</h3>
                <p class="list-item__data">${city}, ${region} ${postalCode}</p>
            </li>
            <li class="geolocation__list-item">
                <h3 class="list-item__title">Timezone</h3>
                <p class="list-item__data">UTC ${timezone}</p>
            </li>
            <li class="geolocation__list-item">
                <h3 class="list-item__title">ISP</h3>
                <p class="list-item__data">${isp}</p>
            </li>
        </ul>
    `;

    el.innerHTML = markup;
}