import { sendErrorResponse } from '../../src/utils/sendRequest.js';
import * as adminController from '../../src/controllers/adminController.js';

import { deleteUser } from '../../src/controllers/adminController.js';

export default (req, res) => {
    console.log('test');
    adminController.authenticate(req, res, () => {
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
