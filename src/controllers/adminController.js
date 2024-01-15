require('dotenv').config();

const db = require('../utils/db')

const { sendErrorResponse, sendSuccessResponse } = require('../utils/sendRequest.js')

const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

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

// Mendapatkan daftar pengguna
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

// Menambahkan pengguna
const addUser = (req, res) => {
  const { username, email } = req.body

  if (!username || !email) {
    return sendErrorResponse(req, res, 400);
  } else {
    // Periksa apakah username sudah ada dalam database
    db.query(
      'SELECT username FROM mapserviceusers WHERE username = ?',
      [username],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          return sendErrorResponse(req, res, 500);
        } else if (results.length > 0) {
          return sendErrorResponse(req, res, 409, 'Username sudah digunakan.');
        } else {
          // Tambahkan pengguna jika username unik
          db.query(
            'INSERT INTO mapserviceusers (username, email) VALUES (?, ?)',
            [username, email],
            (error, results, fields) => {
              if (error) {
                console.log(error);
                return sendErrorResponse(req, res, 500);
              } else {
                return sendSuccessResponse(req, res, 201, { message: 'Pengguna berhasil ditambahkan.' });
              }
            }
          )
        }
      }
    )
  }
};

// Mengedit pengguna
const editUser = (req, res) => {
  const userId = req.query.userId
  const { username, email } = req.body

  if (!username || !email) {
    return sendErrorResponse(req, res, 400);
  } else {
    // Periksa apakah pengguna dengan ID yang diberikan ada dalam database
    db.query(
      'SELECT * FROM mapserviceusers WHERE id = ?',
      [userId],
      (selectError, selectResults, selectFields) => {
        if (selectError) {
          return sendErrorResponse(req, res, 500);
        } else if (selectResults.length === 0) {
          return sendErrorResponse(req, res, 404, 'Pengguna tidak ditemukan.');
        } else {
          // Pengguna ditemukan, lakukan pembaruan
          db.query(
            'UPDATE mapserviceusers SET username = ?, email = ? WHERE id = ?',
            [username, email, userId],
            (updateError, updateResults, updateFields) => {
              if (updateError) {
                return sendErrorResponse(req, res, 500);
              } else {
                return sendSuccessResponse(req, res, 200, { message: 'Pengguna berhasil diperbarui.' });
              }
            }
          )
        }
      }
    )
  }
}

// Menghapus pengguna
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
          return sendErrorResponse(req, res, 404, 'Pengguna tidak ditemukan.');
        } else {
          return sendSuccessResponse(req, res, 200, { message: 'Pengguna berhasil dihapus.' });
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
