require('dotenv').config();

const db = require('../utils/db')

const { sendErrorResponse, sendSuccessResponse } = require('../utils/sendRequest.js')

const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

// Middleware to authenticate admin
const authenticate = (req, res, next) => {
  const adminPassword = req.query.adminPassword;

  if (!adminPassword) {
    return sendErrorResponse(req, res, 400);
  }

  try {
    if (defaultAdminPassword == adminPassword) {
      next();
    } else {
      return sendErrorResponse(req, res, 401);
    }
  } catch (error) {
    console.log(error);
    return sendErrorResponse(req, res, 500);
  }
};

// Get list of users
const getUsers = (req, res) => {
  db.query('SELECT * FROM mapserviceusers', (error, results, fields) => {
    if (error) {
      console.log(error);
      return sendErrorResponse(req, res, 500);
    } else {
      return sendSuccessResponse(req, res, 200, results);
    }
  });
};

// Add a user
const addUser = (req, res) => {
  const { username, email } = req.body

  if (!username || !email) {
    return sendErrorResponse(req, res, 400);
  } else {
    // Check if username already exists in the database
    db.query(
      'SELECT username FROM mapserviceusers WHERE username = ?',
      [username],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          return sendErrorResponse(req, res, 500);
        } else if (results.length > 0) {
          return sendErrorResponse(req, res, 409, 'Username is already taken.');
        } else {
          // Add the user if the username is unique
          db.query(
            'INSERT INTO mapserviceusers (username, email) VALUES (?, ?)',
            [username, email],
            (error, results, fields) => {
              if (error) {
                console.log(error);
                return sendErrorResponse(req, res, 500);
              } else {
                return sendSuccessResponse(req, res, 201, { message: 'User added successfully.' });
              }
            }
          )
        }
      }
    )
  }
};

// Edit a user
const editUser = (req, res) => {
  const userId = req.query.userId
  const { username, email } = req.body

  if (!username || !email) {
    return sendErrorResponse(req, res, 400);
  } else {
    // Check if the user with the given ID exists in the database
    db.query(
      'SELECT * FROM mapserviceusers WHERE id = ?',
      [userId],
      (selectError, selectResults, selectFields) => {
        if (selectError) {
          return sendErrorResponse(req, res, 500);
        } else if (selectResults.length === 0) {
          return sendErrorResponse(req, res, 404, 'User not found.');
        } else {
          // User found, perform the update
          db.query(
            'UPDATE mapserviceusers SET username = ?, email = ? WHERE id = ?',
            [username, email, userId],
            (updateError, updateResults, updateFields) => {
              if (updateError) {
                return sendErrorResponse(req, res, 500);
              } else {
                return sendSuccessResponse(req, res, 200, { message: 'User updated successfully.' });
              }
            }
          )
        }
      }
    )
  }
}

// Delete a user
const deleteUser = (req, res) => {
  const userId = req.query.userId

  db.query(
    'DELETE FROM mapserviceusers WHERE id = ?',
    [userId],
    (error, results, fields) => {
      if (error) {
        console.log(error)
        return sendErrorResponse(req, res, 500);
      } else {
        if (results.affectedRows === 0) {
          return sendErrorResponse(req, res, 404, 'User not found.');
        } else {
          return sendSuccessResponse(req, res, 200, { message: 'User deleted successfully.' });
        }
      }
    }
  )
}

module.exports = {
  authenticate,
  getUsers,
  addUser,
  editUser,
  deleteUser
}
