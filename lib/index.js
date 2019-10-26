const { resolve } = require('path');

export default function() {
  this.addPlugin({
    src: resolve(__dirname, './middleware.js'),
  });
}
