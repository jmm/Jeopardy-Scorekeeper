var bulk = require('bulk-require');
export default bulk(__dirname + '/template', ['**/*.mustache']);
