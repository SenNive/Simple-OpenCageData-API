import { authenticate, forward } from '../../src/controllers/mapController.js';
import { sendErrorResponse } from '../../src/utils/sendRequest.js';

export default (req, res) => {
    authenticate(req, res, () => {
        if (req.method === 'GET') {
            forward(req, res);
        } else {
            sendErrorResponse(req, res, 405);
        }
    });
};