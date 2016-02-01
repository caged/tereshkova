(function() {

  // YOU SHOULD PROVIDE YOUR OWN TOKEN
  mapboxgl.accessToken = '!!!YOUR TOKEN HERE!!!';

  // EDIT THIS TO ADD OR REMOVE LOCATIONS
  var locations = [
    // Top 25 world cities based on population not in the US
    "Tokyo, Japan",
    "Mexico City, Distrito Federal, Mexico",
    "Mumbai, Maharashtra, India",
    "Sao Paulo, SRo Paulo, Brazil",
    "Delhi, India",
    "Shanghai, China",
    "Kolkata, West Bengal, India",
    "Dhaka, Bangladesh",
    "Buenos Aires, Ciudad de Buenos Aires, Argentina",
    "Karachi, Sind, Pakistan",
    "Cairo, Al Qahirah, Egypt",
    "Rio de Janeiro, Brazil",
    "Osaka, Japan",
    "Beijing, China",
    "Manila, Metropolitan Manila, Philippines",
    "Moscow, Moskva, Russia",
    "Istanbul, Turkey",
    "Paris, France",
    "Seoul, Korea, South",
    "Lagos, Nigeria",
    "Jakarta, Jakarta Raya, Indonesia",
    "Guangzhou, Guangdong, China",
    "London, Westminster, United Kingdom",
    "Lima, Peru",
    "Tehran, Iran",
    // Top 50 US cities based on population
    "New York, New York",
    "Los Angeles, California",
    "Chicago, Illinois",
    "Miami, Florida",
    "Philadelphia, Pennsylvania",
    "Dallas, Texas",
    "Atlanta, Georgia",
    "Boston, Massachusetts",
    "Houston, Texas",
    "Washington, D.C., District of Columbia",
    "Detroit, Michigan",
    "Phoenix, Arizona",
    "San Francisco, California",
    "Seattle, Washington",
    "Irvine, California",
    "San Diego, California",
    "Minneapolis, Minnesota",
    "San Juan, United States",
    "Tampa, Florida",
    "Denver, Colorado",
    "Baltimore, Maryland",
    "St. Louis, Missouri",
    "Fort Lauderdale, Florida",
    "Long Beach, California",
    "Cleveland, Ohio",
    "Portland, Oregon",
    "Pittsburgh, Pennsylvania",
    "Las Vegas, Nevada",
    "San Bernardino, California",
    "San Jose, California",
    "Cincinnati, Ohio",
    "Sacramento, California",
    "Oakland, California",
    "Virginia Beach, Virginia",
    "San Antonio, Texas",
    "Kansas City, Missouri",
    "Ft. Worth, Texas",
    "Indianapolis, Indiana",
    "Milwaukee, Wisconsin",
    "Orlando, Florida",
    "Providence, Rhode Island",
    "Columbus, Ohio",
    "West Palm Beach, Florida",
    "Raleigh, North Carolina",
    "Austin, Texas",
    "Birmingham, Alabama",
    "Mesa, Arizona",
    "Memphis, Tennessee",
    "Norfolk, Virginia",
    "Bridgeport, Connecticut"
   ]

  var locationName,
      origin,
      olat,
      olon,
      offset = [-0.2, 0.2],

  // Properties used when animating in on a location
  easeInProperties = {
    zoom: 17,
    duration: 10000,
    pitch: 25,
    bearing: 45
  },

  // Properties used when animating back from a location
  easeBackProperties = {
    zoom: 14,
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


    locationName = shuffle(locations)[0]

    client.geocodeForward(locationName, {}, function(err, res) {
      var location = res.features[0]
      origin = location.center
      olat = origin[1]
      olon = origin[0]

      document.querySelector('.js-dest-info').style.display = 'block'
      document.querySelector('.js-destination-name').innerHTML = locationName

      map.setCenter(origin)
      setTimeout(transitionToRandomDestination, 5000)
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
