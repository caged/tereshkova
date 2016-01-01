(function() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiY2FnZWQiLCJhIjoiQjd2aXNGYyJ9.gr1QeGYwG1QYUW47I-DqaQ';

  var olat = 45.5234514990001,
      olon = -122.6762071

  var easeInProperties = {
    zoom: 17,
    duration: 10000,
    pitch: 25,
    bearing: 90
  }

  var easeBackProperties = {
    zoom: 13,
    duration: 5000,
    pitch: 0,
    bearing: 0
  }

  var client = new MapboxClient(mapboxgl.accessToken)

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v8',
    center: [olon, olat],
    zoom: 13
  })

  map.off('moveend')

  map.on('load', function() {
    transitionToRandomDestination()
  })

  var source = new mapboxgl.GeoJSONSource()

  function randomBetween(f, t) {
    return (Math.random() * (f - t) + t)
  }

  function transitionToRandomDestination() {
    var distanceLat = randomBetween(-0.1, 0.1),
        distanceLon = randomBetween(-0.1, 0.1)

    var dlon = (olon + distanceLon),
        dlat = (olat + distanceLat)
        q = dlon + "," + dlat

    console.log('TRANSITIONING', dlon, dlat);
    var options = {
      proximity: {
        latitude: olat,
        longitude: olon
      }
    }

    client.geocodeForward(q, options, function(err, res) {
      var originPoint = turf.point([olon, olat]),
          destPoint   = turf.point([dlon, dlat]),
          dest = res.features[0].place_name,
          dist = turf.distance(originPoint, destPoint, 'miles')

      document.querySelector('.js-dest-info').style.display = 'block'
      document.querySelector('.js-destination-distance').innerHTML = Math.floor(dist) + " miles away. "
      document.querySelector('.js-destination-name').innerHTML = dest


      map.once('moveend', function() {
        setTimeout(function() {
          map.easeTo(easeInProperties)
          map.once('moveend', function() {
            map.easeTo(easeBackProperties)
            map.once('moveend', function() {
              console.log('FINAL MOVE END');
              transitionToRandomDestination()
            })
          })
        }, 5000)
      })

      map.jumpTo({ center: [dlon, dlat] })
    })
  }
})()
