const adminController = require('../../src/controllers/adminController');
const { sendErrorResponse } = require('../../src/utils/sendRequest.js');

module.exports = (req, res) => {
    adminController.authenticate(req, res, (err, isAuthenticated) => {
        if (err) {
            return;
        }

        if (isAuthenticated) {
            switch (req.method) {
                case 'GET':
                    adminController.getUsers(req, res);
                    break;
                case 'POST':
                    adminController.addUser(req, res);
                    break;
                case 'PUT':
                    adminController.editUser(req, res);
                    break;
                case 'DELETE':
                    adminController.deleteUser(req, res);
                    break;
                default:
                    sendErrorResponse(req, res, 405);
            }
        }
    });
};


