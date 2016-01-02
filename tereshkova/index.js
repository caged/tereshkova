(function() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiY2FnZWQiLCJhIjoiQjd2aXNGYyJ9.gr1QeGYwG1QYUW47I-DqaQ';

  var cities = {
    memphis: [-90.0489800999999, 35.149534299],
    portland: [-122.6762071, 45.5234514990001]
  }

  var origin = cities.memphis

  var olat = origin[1],
      olon = origin[0]

  var easeInProperties = {
    zoom: 17,
    duration: 10000,
    pitch: 25,
    bearing: 45
  }

  var easeBackProperties = {
    zoom: 13,
    duration: 5000,
    pitch: 0,
    bearing: 0
  }

  var client = new MapboxClient(mapboxgl.accessToken)
  var source = new mapboxgl.GeoJSONSource({ data: { type: 'FeatureCollection', features: [] } })

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v8',
    center: origin,
    zoom: 13
  })

  map.on('style.load', function () {
    map.addSource('destinations', source)
    map.addLayer({
        "id": "destinations",
        "type": "circle",
        "source": "destinations"
    })
  })

  map.on('load', function() {
    transitionToRandomDestination()
  })

  function randomBetween(f, t) {
    return (Math.random() * (f - t) + t)
  }

  function transitionToRandomDestination() {
    var distanceLat = randomBetween(-0.2, 0.2),
        distanceLon = randomBetween(-0.2, 0.2)

    var dlon = (olon + distanceLon),
        dlat = (olat + distanceLat)
        q = dlon + "," + dlat

    client.geocodeForward(q, {}, function(err, res) {
      var originPoint = turf.point(origin),
          destPoint   = turf.point([dlon, dlat]),
          dest = res.features[0].place_name,
          dist = turf.distance(originPoint, destPoint, 'miles')

      document.querySelector('.js-dest-info').style.display = 'block'
      document.querySelector('.js-destination-distance').innerHTML = Math.floor(dist) + " miles away."
      document.querySelector('.js-destination-name').innerHTML = dest + " "

      map.once('moveend', function() {
        setTimeout(function() {
          map.easeTo(easeInProperties)
          map.once('moveend', function() {
            setTimeout(function() {
              map.easeTo(easeBackProperties)
              map.once('moveend', function() {
                transitionToRandomDestination()
              })
            }, 5000)
          })
        }, 5000)
      })

      source.setData({ type: 'FeatureCollection',
        features: [destPoint]
      })
      map.jumpTo({ center: [dlon, dlat] })
    })
  }
})()
