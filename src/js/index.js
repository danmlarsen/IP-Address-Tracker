import Leaflet from 'leaflet';
import '../../node_modules/leaflet/dist/leaflet.css';

import locationIcon from 'url:../images/icon-location.svg';

import * as render from './render';

const API_KEY = process.env.API_KEY;

// 
// DOM Selections
// 
const headerEl = document.querySelector('.header');
const upArrowEl = document.querySelector('.up-arrow');
const geolocationEl = document.querySelector('.geolocation');
const searchFormEl = document.querySelector('.search__form');
const searchInputEl = document.querySelector('.search__input');

// 
// State
// 
let leafletMarker;

const updateMap = function (location) {
    const { lat, lng } = location;

    // Move map view to new location
    map.setView([lat, lng], 15, {});

    // Remove old marker
    if (leafletMarker) map.removeLayer(leafletMarker);

    // Set new marker on map
    leafletMarker = Leaflet.marker([lat, lng], {
        icon: Leaflet.icon({
            iconUrl: locationIcon,
            iconSize: [46, 56],
        }),
    }).addTo(map);
};

const fetchData = async function (url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error fetching API data.');

        return await res.json();
    } catch (err) {
        throw err;
    }
};

// Handle lookup
const handleLookup = async function (lookupString = '') {
    try {
        render.loading(geolocationEl);
        const data = await fetchData(
            `https://geo.ipify.org/api/v1?apiKey=${API_KEY}${lookupString}`
        );

        // API success. Render map and geodata
        updateMap(data.location);
        render.geoData(data, geolocationEl);
    } catch (err) {
        render.errorMessage(err, geolocationEl);
    }
};

// Handle form submit
const handleSubmit = async function (e) {
    e.preventDefault();
    render.invalidInput(false, searchInputEl);

    // Get input
    const lookupInputValue = searchInputEl.value.trim().toLowerCase();
    let lookupString = '';

    // Validate input
    // IP match
    if (
        lookupInputValue.match(
            /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        )
    ) {
        lookupString = `&ipAddress=${lookupInputValue}`;
    // Domain match
    } else if (
        lookupInputValue.match(
            /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
        )
    ) {
        lookupString = `&domain=${lookupInputValue}`;
    } else {
        render.invalidInput(true, searchInputEl);
        return;
    }

    // Fetch and render data
    await handleLookup(lookupString);

    // searchInput.value = '';
    searchInputEl.blur();

    // Scroll down to make map visible (mobile UX)
    geolocationEl.scrollIntoView({ behavior: 'smooth' });
};

// Events
searchFormEl.addEventListener('submit', handleSubmit);
upArrowEl.addEventListener('click', () =>
    headerEl.scrollIntoView({ behavior: 'smooth' })
);

// 
// Initialize
// 

// Init leaflet map
const map = Leaflet.map('map', {
    zoomControl: false,
    zoom: 13,
});
Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Lookup own ip
handleLookup();

// Observer that triggers when header is mostly out of view (mobile UX)
// Shows arrow that scrolls to top
const headerObserver = new IntersectionObserver(
    (entries) => {
        const [entry] = entries;
        !entry.isIntersecting
            ? upArrowEl.classList.remove('hidden')
            : upArrowEl.classList.add('hidden');
    },
    { root: null, threshold: 0.5 }
);
headerObserver.observe(headerEl);