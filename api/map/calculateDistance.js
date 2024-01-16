const { authenticate, calculateDistance } = require('../../src/controllers/mapController');
const { sendErrorResponse } = require('../../src/utils/sendRequest');

module.exports = (req, res) => {
    authenticate(req, res, () => {
        if (req.method === 'GET') {
            calculateDistance(req, res);
        } else {
            sendErrorResponse(req, res, 405);
        }
    });
};