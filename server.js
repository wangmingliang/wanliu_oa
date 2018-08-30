/* eslint-disable */

var webpack = require('webpack');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('tiny', {
    skip: function (req, res) {
        return res.statusCode < 400
    }
}));
//设置跨域访问
// process.env.ACCESS_ORIGIN = "http://localhost:3000";
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.ACCESS_ORIGIN||"*");
    res.header("Access-Control-Allow-Headers", "Accept, Origin, X-Requested-With, Content-Type, Last-Modified, Cache-Control");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "3600");

    next();
});
app.use(bodyParser({limit : "10000kb"}));
app.use(bodyParser.json({limit: '10000kb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('312de637781ae695618ba9c9095bfd9c'));
// app.use(express.static(path.join(__dirname, 'public')));

//设置默认为 development 模式
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var isdev = process.env.NODE_ENV === 'development';

var static_path = path.join(__dirname, 'dist');
var public_path = path.join(__dirname, 'dist');
console.log(isdev);
if (isdev) {
    app.use(express.static(public_path))
        .use('/dist', express.static(static_path))
        .get('*', function (req, res) {
            console.log(req);
            res.sendFile(path.join(__dirname, 'dist/index.html'));
        });
}



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    if(err.status==404){
        res.render('404');
    }else{
      console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

app.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`web started. Listening at ${process.env.PORT || 3000}`);
});

module.exports = app;
