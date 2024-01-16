const convert = require('xml-js');

const HTTP_STATUS_CODES = require('./HTTP_STATUS_CODES.js')

const convertJsonToXml = (json) => {
    return convert.json2xml(json, { compact: true, spaces: 4 });
};

const sendErrorResponse = (req, res, status, message = "") => {
    const errorResponse = { message: `${HTTP_STATUS_CODES[status]}${message ? ' ' + message : ''}` };
    sendResponse(req, res, status, errorResponse);
};

const sendSuccessResponse = (req, res, status, data) => {
    sendResponse(req, res, status, data);
};

const sendResponse = (req, res, status, payload) => {
    if (req.headers.accept === 'application/xml') {
        const result = convertJsonToXml(payload);
        res.writeHead(status, { 'Content-Type': 'application/xml' });
        res.end(result);
    } else {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(payload));
    }
};

module.exports = {
    sendErrorResponse,
    sendSuccessResponse
};