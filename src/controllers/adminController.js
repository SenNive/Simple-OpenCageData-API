require('dotenv').config();

const { sql } = require('@vercel/postgres');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/sendRequest.js');

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
const getUsers = async (req, res) => {
  try {
    const results = await sql`SELECT * FROM mapserviceusers`;
    return sendSuccessResponse(req, res, 200, results);
  } catch (error) {
    console.log(error);
    return sendErrorResponse(req, res, 500);
  }
};

// Add a user
const addUser = async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return sendErrorResponse(req, res, 400);
  } else {
    try {
      const userExists = await sql`SELECT username FROM mapserviceusers WHERE username = ${username}`;
      if (userExists.length > 0) {
        return sendErrorResponse(req, res, 409, 'Username is already taken.');
      } else {
        await sql`INSERT INTO mapserviceusers (username, email) VALUES (${username}, ${email})`;
        return sendSuccessResponse(req, res, 201, { message: 'User added successfully.' });
      }
    } catch (error) {
      console.log(error);
      return sendErrorResponse(req, res, 500);
    }
  }
};

// Edit a user
const editUser = async (req, res) => {
  const userId = req.query.userId;
  const { username, email } = req.body;

  if (!username || !email) {
    return sendErrorResponse(req, res, 400);
  } else {
    try {
      const userExists = await sql`SELECT * FROM mapserviceusers WHERE id = ${userId}`;
      if (userExists.length === 0) {
        return sendErrorResponse(req, res, 404, 'User not found.');
      } else {
        await sql`UPDATE mapserviceusers SET username = ${username}, email = ${email} WHERE id = ${userId}`;
        return sendSuccessResponse(req, res, 200, { message: 'User updated successfully.' });
      }
    } catch (error) {
      console.log(error);
      return sendErrorResponse(req, res, 500);
    }
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const userId = req.query.userId;

  try {
    const result = await sql`DELETE FROM mapserviceusers WHERE id = ${userId}`;
    if (result.count === 0) {
      return sendErrorResponse(req, res, 404, 'User not found.');
    } else {
      return sendSuccessResponse(req, res, 200, { message: 'User deleted successfully.' });
    }
  } catch (error) {
    console.log(error);
    return sendErrorResponse(req, res, 500);
  }
};

module.exports = {
  authenticate,
  getUsers,
  addUser,
  editUser,
  deleteUser
};
