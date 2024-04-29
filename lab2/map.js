// Add your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoia2lhbmFtb3JhZGkiLCJhIjoiY2twcmE2YThrMDR1bzJxcXI2bDBpc2lqYyJ9.qeBCJlro9gWWWg4j25jmzQ';
const map = new mapboxgl.Map({
  container: 'map', // Specify the container ID
  style:'mapbox://styles/kianamoradi/clvhucuxk00a601ob3rvoe3w0', // Specify which map style to use
  center: [-123.056, 49.239], // Specify the starting position
  zoom: 10.12 // Specify the starting zoom
});
const params = document.getElementById('params');

// this code will call sets up a function which requests 'Mapbox Isochrone API' to generate an isochrone 
const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/'; 
const lon = -123.123589; 
const lat = 49.261218;
let profile = 'cycling'; 
let minutes = 10; 

// this code creates a marker to indicate Vancouver General Hospital
const marker = new mapboxgl.Marker({
  'color': '#314ccd'
});
const lngLat = {
  lon: lon, 
  lat: lat,
};
// this function uses 'fetch()' to make the call and integrate Isochrone API into our code
async function getIso(){
  const query = await fetch(`${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
{ method: 'GET' });
  const data = await query.json(); 
  map.getSource('iso').setData(data);
}

// add interactivity by allowing user to click on buttons and change the options
params.addEventListener('change', (event) => {
  if (event.target.name === 'profile') {profile = event.target.value} 
  else if (event.target.name === 'duration') {minutes = event.target.value}
  getIso();
});

map.on('load', () => {
  map.addSource('iso', {
    type: 'geojson', 
    data: {
      type: 'FeatureCollection', 
      features: []
    }
  });
  map.addLayer({
    id: 'isoLayer', 
    type: 'fill', 
    source: 'iso', 
    layout: {}, 
    paint: {
     'fill-color': '#f5bce9', 
     'fill-opacity': 0.6
    }
  },
  'poi-label'
);

// Initialize the marker at the query coordinates
marker.setLngLat(lngLat).addTo(map);
getIso();
});
