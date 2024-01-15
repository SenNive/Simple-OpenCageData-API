const db = require('./db')
const axios = require('axios')
const geolib = require('geolib')
const convert = require('xml-js');

const apiKey = '***REMOVED***'

// import errorCode.js
const ERROR_CODES = require('./errorCode.js').default

const convertJsonToXml = (json) => {
  return convert.json2xml(json, { compact: true, spaces: 4 });
};

const authenticate = (req, res, next) => {
  const username = req.query.username

  if (!username) {
    return res
      .status(400)
      .json({ message: ERROR_CODES[400] })
  }

  try {
    checkUsernameInDatabase(username, (error, userExists) => {
      if (error) {
        console.log(error)
        res
          .status(500)
          .json({ message: ERROR_CODES[500] })
      } else {
        if (userExists) {
          next()
        } else {
          res
            .status(401)
            .json({ message: ERROR_CODES[401] })
        }
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: ERROR_CODES[500] })
  }
}

// Fungsi untuk memeriksa apakah username valid
const checkUsernameInDatabase = (username, callback) => {
  try {
    const query = 'SELECT * FROM mapserviceusers WHERE username = ?'
    db.query(query, [username], (error, rows) => {
      if (error) {
        callback(error, null)
      } else {
        callback(null, rows.length > 0)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

// Fungsi untuk melakukan worldwide geocoding
const worldwide = async (req, res) => {
  const query = req.query.query

  if (!query) {
    return res
      .status(400)
      .json({ message: ERROR_CODES[400] })
  }

  const worldwideGeocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${apiKey}`
  try {
    const response = await axios.get(worldwideGeocodeUrl)

    res.format({
      'application/json': function () {
        res.json(response.data);
      },

      'application/xml': function () {
        // Convert JSON data to XML
        var xml = convertJsonToXml(response.data);
        res.type('application/xml');
        res.send(xml);
      },

      'default': function () {
        // log the request and respond with 406
        res.status(406).send(ERROR_CODES[406]);
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: ERROR_CODES[500] + " " + error.message })
  }
};

// Fungsi untuk melakukan reverse geocoding (latitude/longitude to text)
const reverse = async (req, res) => {
  const { lat, lng } = req.query

  if (!lat || !lng) {
    return res.status(400).json({
      message: ERROR_CODES[400]
    })
  }

  const reverseGeocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
  try {
    const response = await axios.get(reverseGeocodeUrl)

    res.format({
      'application/json': function () {
        res.json(response.data);
      },

      'application/xml': function () {
        var xml = convertJsonToXml(response.data);
        res.type('application/xml');
        res.send(xml);
      },

      'default': function () {
        res.status(406).send(ERROR_CODES[406]);
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: ERROR_CODES[500] + " " + error.message })
  }
}

// Fungsi untuk melakukan forward geocoding (text to latitude/longitude)
const forward = async (req, res) => {
  const query = req.query.query

  if (!query) {
    return res
      .status(400)
      .json({ message: ERROR_CODES[400] })
  }

  const forwardGeocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${apiKey}`
  try {
    const response = await axios.get(forwardGeocodeUrl)
    if (response.data.results.length > 0) {
      const firstResult = response.data.results[0]
      const { geometry } = firstResult

      res.format({
        'application/json': function () {
          res.json({
            latitude: geometry.lat,
            longitude: geometry.lng
          });
        },

        'application/xml': function () {
          var xml = convertJsonToXml({
            latitude: geometry.lat,
            longitude: geometry.lng
          });
          res.type('application/xml');
          res.send(xml);
        },

        'default': function () {
          res.status(406).send(ERROR_CODES[406]);
        }
      });
    } else {
      res.status(404).json({ message: ERROR_CODES[404] })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: ERROR_CODES[500] + " " + error.message })
  }
}

const forwardShort = async query => {
  const forwardGeocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${apiKey}`
  try {
    const response = await axios.get(forwardGeocodeUrl)
    return response.data
  } catch (error) {
    throw new Error('Terjadi kesalahan dalam forward geocoding.')
  }
}

// Fungsi untuk menghitung jarak antara dua lokasi
const calculateDistance = async (req, res) => {
  const from = req.query.from
  const to = req.query.to

  if (!from || !to) {
    return res.status(400).json({
      message: ERROR_CODES[400]
    })
  }

  try {
    const fromLocation = await forwardShort(from)
    const toLocation = await forwardShort(to)

    // Menggunakan geolib untuk menghitung jarak
    const distance = geolib.getDistance(
      {
        latitude: fromLocation.results[0].geometry.lat,
        longitude: fromLocation.results[0].geometry.lng
      },
      {
        latitude: toLocation.results[0].geometry.lat,
        longitude: toLocation.results[0].geometry.lng
      }
    )

    const distanceInKm = distance / 1000

    res.format({
      'application/json': function () {
        res.json({ distanceInKm: distanceInKm });
      },

      'application/xml': function () {
        var xml = convertJsonToXml({ distanceInKm: distanceInKm });
        res.type('application/xml');
        res.send(xml);
      },

      'default': function () {
        res.status(406).send(ERROR_CODES[406]);
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: ERROR_CODES[500] + " " + error.message })
  }
}

module.exports = {
  authenticate,
  worldwide,
  reverse,
  forward,
  calculateDistance
}
