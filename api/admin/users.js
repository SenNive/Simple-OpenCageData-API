const { authenticate } = require('../../src/controllers/adminController');
const { sendErrorResponse } = require('../../src/utils/sendRequest');

module.exports = (req, res) => {
    authenticate(req, res, () => {
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
    });
};