const fetch = require('node-fetch');

async function test() {
  const startLng = 77.4323; // Nagercoil
  const startLat = 8.1833;
  const endLng = 80.2707; // Chennai
  const endLat = 13.0827;
  
  const madurai = `78.1198,9.9252`;
  
  const routeUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${madurai};${endLng},${endLat}?overview=full&geometries=geojson`;
  
  const routeRes = await fetch(routeUrl);
  const routeData = await routeRes.json();
  
  console.log("Status:", routeData.code);
  if (routeData.waypoints) {
    console.log("Waypoints:", routeData.waypoints.map(w => w.location));
  }
}

test();
