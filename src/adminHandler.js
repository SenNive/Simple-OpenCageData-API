const adminController = require('./adminController')

module.exports = app => {
  app.get(
    '/admin/users',
    adminController.authenticate,
    adminController.getUsers
  )
  app.post(
    '/admin/users',
    adminController.authenticate,
    adminController.addUser
  )
  app.put(
    '/admin/users',
    adminController.authenticate,
    adminController.editUser
  )
  app.delete(
    '/admin/users',
    adminController.authenticate,
    adminController.deleteUser
  )
}
