const fs = require('fs');
const yaml = require('js-yaml');

const swaggerDocument = yaml.load(fs.readFileSync('./docs/swagger.yaml', 'utf8'));
fs.writeFileSync('./public/swagger.json', JSON.stringify(swaggerDocument, null, 2));