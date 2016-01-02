(function() {

  // Provide your own access token
  mapboxgl.accessToken = 'pk.eyJ1IjoiY2FnZWQiLCJhIjoiQjd2aXNGYyJ9.gr1QeGYwG1QYUW47I-DqaQ';

  // EDIT THIS TO ADD OR REMOVE LOCATIONS
  // The format is name : [degree offset min, degree offset max]
  //
  // The offset is how far each random point falls from the center of the given
  // location
  var locations = {
    'Portland, OR': [-0.2, 0.2],
    'New York City': [-0.2, 0.2]
  }

  var locationName,
      origin,
      olat,
      olon,
      offset = [0, 0],

  // Properties used when animating in on a location
  easeInProperties = {
    zoom: 17,
    duration: 10000,
    pitch: 25,
    bearing: 45
  },

  // Properties used when animating back from a location
  easeBackProperties = {
    zoom: 13,
    duration: 5000,
    pitch: 0,
    bearing: 0
  }

  var client = new MapboxClient(mapboxgl.accessToken),
      source = new mapboxgl.GeoJSONSource({ data: { type: 'FeatureCollection', features: [] } }),
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-hybrid-v8',
        zoom: 13
      })

  map.on('style.load', function () {
    map.addSource('destinations', source)
    map.addLayer({
        id: 'destinations',
        type: 'circle',
        source: 'destinations',
        paint: {
          'circle-radius': 6,
          'circle-color': '#fdb109'
        }
    })


    locationName = shuffle(Object.keys(locations))[0]
    client.geocodeForward(locationName, {}, function(err, res) {
      var location = res.features[0]
      origin = location.center
      olat = origin[1]
      olon = origin[0]

      map.setCenter(origin)
      offset = locations[locationName]
      transitionToRandomDestination()
    })
  })

  function transitionToRandomDestination() {
    var distanceLat = randomBetween(offset[0], offset[1]),
        distanceLon = randomBetween(offset[0], offset[1])

    var dlon = (olon + distanceLon),
        dlat = (olat + distanceLat)
        q = dlon + "," + dlat

    client.geocodeForward(q, {}, function(err, res) {
      var originPoint = turf.point(origin),
          destPoint   = turf.point([dlon, dlat]),
          dest = res.features[0].place_name,
          dist = turf.distance(originPoint, destPoint, 'miles')

      document.querySelector('.js-dest-info').style.display = 'block'
      document.querySelector('.js-destination-distance').innerHTML = "Roughly " + Math.floor(dist) + " miles from the center of " + locationName
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

      map.flyTo({
        center: [dlon, dlat],
        speed: 0.3
      })
    })
  }

  // Generate a random value between two numbers
  function randomBetween(f, t) {
    return (Math.random() * (f - t) + t)
  }

  // Fisher–Yates shuffle.  See http://bost.ocks.org/mike/shuffle/
  function shuffle(array) {
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
})()
