const fs = require('fs');
module.exports = {
  key: fs.readFileSync('privkey.pem', 'utf8'),
  cert: fs.readFileSync('fullchain.pem', 'utf8')
};