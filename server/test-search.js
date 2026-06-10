const fetch = require('node-fetch');

async function test() {
  const url = 'http://localhost:5000/api/v1/parking-spots/search?q=Chennai';
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err.message);
  }
}

test();
