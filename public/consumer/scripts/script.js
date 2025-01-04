function main(username, ulat, ulon) {
  const clientList = document.querySelector("#clients");
  const warnings = document.querySelector('.warnings')
  const bottomCard = document.querySelector(".bottom-card");
  const mylatlon = document.querySelector(".my-latlon");
  const view = document.querySelector(".view");
  const viewContainer = document.querySelector(".view-container");
  const myposition = document.querySelector(".myposition")
  const recomends = document.querySelector('.recomends')
  
  // let socket = io.connect("https://locationreal.onrender.com/");
  let socket = io();

  // initializing
  let map = L.map("map").setView([ulat, ulon], 14);
  map.on('click', mapClick);
  console.log(ulat, ulon);
  // Draw polygons
  var polygonCampus = L.polygon(coordinates, { color: "crimson" })
  .addTo(map)
  .bindPopup("Begum Rokeya University! The campus boundary!");
var polygonMess = L.polygon(mess, { color: "green" })
  .addTo(map)
  .bindPopup("Mess! The mess boundary!");


  socket.emit("client-join-location", {
    lat: ulat,
    lon: ulon,
    username: username,
  });
  // notify user join
  socket.on("client-join-server", (data) => {
    joinToast(
      `${data.username ? data.username : data.id} has joined to the map!`
    );
    //notifyMe(`${data.username ? data.username : data.id} joined just now!`, `${data.username ? data.username : data.id} has joined to the map!`)
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution:
            '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a traget="_blank" href="https://github.com/faisal-shohag/realtime_location_tracking">faisal-shohag</a>',
   }).addTo(map);

  //Map tile layer
  viewContainer.addEventListener('click', (e)=>{
    if(e.target.id === 'sat') {
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            maxZoom: 20,
            attribution:
            '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a traget="_blank" href="https://github.com/faisal-shohag/realtime_location_tracking">faisal-shohag</a>',
        }).addTo(map);
     viewContainer.innerHTML = '<div class="street view" id="str"></div>'

    }else {
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution:
            '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a traget="_blank" href="https://github.com/faisal-shohag/realtime_location_tracking">faisal-shohag</a>',
        }).addTo(map);
        viewContainer.innerHTML = '<div class="satellite view" id="sat"></div>'       
    }
  })
  

  let liveSetView = false;
  let present_destination;
  myposition.addEventListener('click', ()=>{map.setView(present_destination, 17); window.history.back()})


  ok = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const acc = position.coords.accuracy;
    present_destination = [lat, lon];
    if (liveSetView) {
      map.setView([data.lat, data.lon], 14);
    }
    socket.emit("client-location", { lat, lon, acc, username: username, platform: platform.description});
    mylatlon.innerHTML = `Lat: ${lat} Lon: ${lon}`;
    
  
    // bottomCard.innerHTML = `
    //     <div class="distance">${
    //       distance < 1
    //         ? (distance * 1000).toFixed(2) + "<span>M</span>"
    //         : distance.toFixed(2) + "<span>KM</span>"
    //     }</div>
    //     <div class="location">BRUR Campus</div>
    //     `;
    // getLocationByLatLon(lat, lon)
    // .then(address => {
    //     address = address+','
    //     locationName = address.split(',')[0]
    //     mylatlon.innerHTML += `<br>${locationName}`
    //     // console.log(locationName)
    // })
  };


  error = (err) => {
    err.code == 1
      ? console.log("Please alllow location service from your device!")
      : console.log("Something went wrong!", err);
  };

  options = {
    enableHighAccuracy: true,
    timeout: 3000,
  };

  navigator.geolocation.watchPosition(ok, error, options);

  let d = 100;
  let polylineGroup = L.layerGroup().addTo(map)
  // Realtime user navigation
  let connected_users = {};
  let updateMap = () => {
    clientList.innerHTML = ``;
    warnings.innerHTML = ``
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    polylineGroup.clearLayers()

    for (let key in connected_users) {
      if (connected_users.hasOwnProperty(key)) {
        connected_users[key].pointMarker();
        campus_stat = rayCasting(
          [connected_users[key].lat, connected_users[key].lon],
          coordinates
        );
        let closestPoint = L.GeometryUtil.closest(map, polygonCampus, [connected_users[key].lat, connected_users[key].lon], true);
        // console.log(closestPoint)
        let distance = calculateDistance(closestPoint.lat, closestPoint.lng, connected_users[key].lat, connected_users[key].lon)
        clientList.innerHTML += `
            <div class="client-card">
            <div class="id">${connected_users[key].username}</div>
            <div class="platform">From <span>${connected_users[key].platform}</span></div>
            <div class="latlon">Lat: ${connected_users[key].lat} | Lon: ${
          connected_users[key].lon
        }</div>
            <div class="status">Boundary status: ${
              campus_stat ? "Inside!" : `Outside(<b>${ distance < 1000
                  ? (distance).toFixed(2) + "<span>m away from the nearest boundary</span>"
                  : (distance/1000).toFixed(2) + "<span>km away</span><b>"
              })`
            }</div>
            
            </div>
            `;
            draw = document.getElementById('drawLine')
           
            L.polyline([
              [closestPoint.lat, closestPoint.lng],
              [connected_users[key].lat, connected_users[key].lon]
            ], {color: 'transparent'}).addTo(polylineGroup)
            
            // draw.addEventListener('click', () =>{
            //   console.log(draw)
            //   (draw.checked) ? line.addTo(map) : map.removeLayer(line.addTo(map))
            //  })
        // warnings 
        if(campus_stat) {
          warnings.innerHTML += `
          <div class="harm"><b>[HARM]</b> FAISAL is <span>inside</span> your boundary!</div>
          `
        } else if(parseInt(distance)  >= 50 && parseInt(distance) <= 100) {
          warnings.innerHTML += `
          <div class="warn"><b>[WARNING]</b> FAISAL is <span>${distance.toFixed(2)}m</span> away from boundary lines</div>
          `
        } else if(parseInt(distance) > 0 && parseInt(distance) <= 50) {
          warnings.innerHTML += `
          <div class="danger"><b>[DANGER]</b> FAISAL is <span>${distance.toFixed(2)}m</span> away from boundary lines</div>
          `
        } else if(parseInt(distance) == 0){
          warnings.innerHTML += `
          <div class="harm"><b>[HARM]</b> FAISAL is <span>just crossed</span> your boundary!</div>
          `
        } 
      }
    }
  };

  socket.on("server-location", (data) => {
    connected_users[data.id] = {
      lat: data.lat,
      lon: data.lon,
      acc: data.acc,
      username: data.username,
      platform: data.platform,
      pointMarker: function () {
        marker = L.marker([data.lat, data.lon])
          .addTo(map)
          .bindTooltip(data.username ? data.username : data.id, {
            parmanent: true,
            direction: "top",
          })
          .openTooltip();
      },
    };
    updateMap();
  });

  socket.on("disconnected_user", (data) => {
    delete connected_users[data.id];
    updateMap();
    leftToast(
      `${data.username ? data.username : data.id} has left from the map!`
    );
  });

 

  let rayCasting = (coords, polygon) => {
    let x = coords[0];
    let y = coords[1];

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i][0],
        yi = polygon[i][1];
      let xj = polygon[j][0],
        yj = polygon[j][1];

      let intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  };

  recomends.innerHTML = '';
  // recomendation places
  for(let i=0; i<recomendData.length; i++) {
    recomends.innerHTML += `
    <div class="rec-wrap">
    <div id="${i}" class="rec" style="background-image: url('${recomendData[i].img}');">
      <div class="rec-title">${recomendData[i].placeName}</div>
      <div class="rec-desc"><i class="ri-map-pin-2-fill"></i> ${recomendData[i].desc}</div>
      <div class="hover-button"><i class="ri-compass-discover-fill"></i></div>
    </div>
    </div>
    `
  }

  recEl = document.querySelectorAll('.rec')
  // const recClose = document.querySelector('.rec-close')
  recEl.forEach(function(element) {
  element.addEventListener('click', ()=> {
    let id = parseInt(element.id);
    // console.log(id)
    map.setView(recomendData[id].latlon, 17);
    recClose.click();
  })
})

}
