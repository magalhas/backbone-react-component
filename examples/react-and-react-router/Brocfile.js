var esTranspiler = require('broccoli-babel-transpiler');
var webpackify = require('broccoli-webpack');
var mergeTrees = require('broccoli-merge-trees');

var scripts = esTranspiler('src/javascripts');

var js_bundler = webpackify(scripts, {
    entry: './global',
    output: {filename: 'global.js'},  
});

module.exports = mergeTrees(['src/htdocs',js_bundler]); 