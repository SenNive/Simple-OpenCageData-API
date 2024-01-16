require('dotenv').config();

const db = require('../utils/db')
const axios = require('axios')
const geolib = require('geolib')
const { sendErrorResponse, sendSuccessResponse } = require('../utils/sendRequest.js')

const apiKey = process.env.API_KEY;

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const username = req.query.username;

  if (!username) {
    return sendErrorResponse(req, res, 400);
  }

  try {
    checkUsernameInDatabase(username, (error, userExists) => {
      if (error) {
        console.log(error);
        return sendErrorResponse(req, res, 500);
      } else {
        if (userExists) {
          next();
        } else {
          return sendErrorResponse(req, res, 401);
        }
      }
    });
  } catch (error) {
    console.log(error);
    return sendErrorResponse(req, res, 500);
  }
};

// Function to check if the username is valid
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

// Function to perform worldwide geocoding
const worldwide = async (req, res) => {
  const query = req.query.query

  if (!query) {
    return sendErrorResponse(req, res, 400);
  }

  const worldwideGeocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${apiKey}`
  try {
    const response = await axios.get(worldwideGeocodeUrl)
    sendSuccessResponse(req, res, 200, response.data);
  } catch (error) {
    console.log(error)
    sendErrorResponse(req, res, 500, error.message);
  }
};

// Function to perform reverse geocoding (latitude/longitude to text)
const reverse = async (req, res) => {
  const { lat, lng } = req.query

  if (!lat || !lng) {
    return sendErrorResponse(req, res, 400);
  }

  const reverseGeocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
  try {
    const response = await axios.get(reverseGeocodeUrl)
    sendSuccessResponse(req, res, 200, response.data);
  } catch (error) {
    console.log(error)
    sendErrorResponse(req, res, 500, error.message);
  }
};

// Function to perform forward geocoding (text to latitude/longitude)
const forward = async (req, res) => {
  const query = req.query.query

  if (!query) {
    return sendErrorResponse(req, res, 400);
  }

  const forwardGeocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${apiKey}`
  try {
    const response = await axios.get(forwardGeocodeUrl)
    if (response.data.results.length > 0) {
      const firstResult = response.data.results[0]
      const { geometry } = firstResult

      sendSuccessResponse(req, res, 200, {
        latitude: geometry.lat,
        longitude: geometry.lng
      });
    } else {
      sendErrorResponse(req, res, 404);
    }
  } catch (error) {
    console.log(error)
    sendErrorResponse(req, res, 500, error.message);
  }
};

// Function to perform short forward geocoding
const forwardShort = async query => {
  const forwardGeocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${apiKey}`
  try {
    const response = await axios.get(forwardGeocodeUrl)
    return response.data
  } catch (error) {
    throw new Error('An error occurred in forward geocoding.')
  }
}

// Function to calculate the distance between two locations
const calculateDistance = async (req, res) => {
  const from = req.query.from
  const to = req.query.to

  if (!from || !to) {
    return sendErrorResponse(req, res, 400);
  }

  try {
    const fromLocation = await forwardShort(from)
    const toLocation = await forwardShort(to)

    // Using geolib to calculate distance
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

    sendSuccessResponse(req, res, 200, { distanceInKm: distanceInKm });
  } catch (error) {
    console.log(error)
    sendErrorResponse(req, res, 500, error.message);
  }
};

module.exports = {
  authenticate,
  worldwide,
  reverse,
  forward,
  calculateDistance
}
