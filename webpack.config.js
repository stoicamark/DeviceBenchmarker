var path = require('path');

 module.exports = {
   entry: './test/ScoreAdjuster.test.ts',
   resolve: {
     extensions: ['.webpack.js', '.web.js', '.ts', '.js']
   },
   module: {
     loaders: [
       { test: /\.ts$/, loader: 'ts-loader' }
     ]
   },
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist')
   }
 }