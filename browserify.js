var browserify = require('browserify');
var remapify = require('remapify');
var b = browserify();

b.add('./client/js/main.js');

b.plugin(remapify, [{
    cwd: './client/js',
    src: '**/*.js',
    expose: ''
}]);

b.bundle().pipe(process.stdout);
