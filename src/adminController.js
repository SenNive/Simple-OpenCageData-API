const db = require('./db')

const defaultAdminPassword = '***REMOVED***'

const authenticate = (req, res, next) => {
  const adminPassword = req.query.adminPassword

  if (!adminPassword) {
    return res.status(400).json({ message: 'Admin Password Diperlukan' })
  }

  try {
    if (defaultAdminPassword == adminPassword) {
      next()
    } else {
      res.status(401).json({ message: 'Password Salah' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Terjadi kesalahan dalam autentikasi.' })
  }
}

// Mendapatkan daftar pengguna
const getUsers = (req, res) => {
  db.query('SELECT * FROM mapserviceusers', (error, results, fields) => {
    if (error) {
      console.log(error)
      res
        .status(500)
        .json({ message: 'Terjadi kesalahan dalam mengambil data pengguna.' })
    } else {
      res.status(200).json(results)
    }
  })
}

// Menambahkan pengguna
const addUser = (req, res) => {
  const { username, email } = req.body

  if (!username || !email) {
    res.status(400).json({ message: 'Harap isi semua kolom yang diperlukan.' })
  } else {
    // Periksa apakah username sudah ada dalam database
    db.query(
      'SELECT username FROM mapserviceusers WHERE username = ?',
      [username],
      (error, results, fields) => {
        if (error) {
          console.log(error)
          res.status(500).json({
            message: 'Terjadi kesalahan dalam menambahkan pengguna baru.'
          })
        } else if (results.length > 0) {
          res.status(409).json({ message: 'Username sudah digunakan.' })
        } else {
          // Tambahkan pengguna jika username unik
          db.query(
            'INSERT INTO mapserviceusers (username, email) VALUES (?, ?)',
            [username, email],
            (error, results, fields) => {
              if (error) {
                console.log(error)
                res.status(500).json({
                  message: 'Terjadi kesalahan dalam menambahkan pengguna baru.'
                })
              } else {
                res
                  .status(201)
                  .json({ message: 'Pengguna berhasil ditambahkan.' })
              }
            }
          )
        }
      }
    )
  }
}

// Mengedit pengguna
const editUser = (req, res) => {
  const userId = req.query.userId
  const { username, email } = req.body

  if (!username || !email) {
    res.status(400).json({ message: 'Harap isi semua kolom yang diperlukan.' })
  } else {
    // Periksa apakah pengguna dengan ID yang diberikan ada dalam database
    db.query(
      'SELECT * FROM mapserviceusers WHERE id = ?',
      [userId],
      (selectError, selectResults, selectFields) => {
        if (selectError) {
          res
            .status(500)
            .json({ message: 'Terjadi kesalahan dalam mengedit pengguna.' })
        } else if (selectResults.length === 0) {
          res.status(404).json({ message: 'Pengguna tidak ditemukan.' })
        } else {
          // Pengguna ditemukan, lakukan pembaruan
          db.query(
            'UPDATE mapserviceusers SET username = ?, email = ? WHERE id = ?',
            [username, email, userId],
            (updateError, updateResults, updateFields) => {
              if (updateError) {
                res.status(500).json({
                  message: 'Terjadi kesalahan dalam mengedit pengguna.'
                })
              } else {
                res
                  .status(200)
                  .json({ message: 'Pengguna berhasil diperbarui.' })
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
        res
          .status(500)
          .json({ message: 'Terjadi kesalahan dalam menghapus pengguna.' })
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Pengguna tidak ditemukan.' })
        } else {
          res.status(200).json({ message: 'Pengguna berhasil dihapus.' })
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
