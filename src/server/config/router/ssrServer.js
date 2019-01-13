const path = require('path');
const fs = require('fs');

const express = require('express');

const ssrServer = express();

ssrServer.set('view engine', 'ejs');

ssrServer.get('/', function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        fs.stat(path.join(__dirname, '../../dist/index.html'), (err, stat) => {
            if (err) {
                console.log(err);
                console.log('stat error');
                res.end('no such file');
            } else {
                var stream = fs.createReadStream(path.join(__dirname, '../../dist/index.html'));
                stream.pipe(res);
            }
        });
    } catch (error) {
        next && next();
    }
    return;
});

ssrServer.use(
    express.static(path.join(__dirname, '../../dist'), {
        maxAge: process.env.NODE_ENV == 'production' ? '1d' : 0
    })
);

ssrServer.use(function(req, res) {
    console.log(`do this logic`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        fs.stat(path.join(__dirname, '../../dist/index.html'), (err, stat) => {
            if (err) {
                console.log(err);
                console.log('stat error');
                res.end('no such file');
            } else {
                var stream = fs.createReadStream(path.join(__dirname, '../../dist/index.html'));
                stream.pipe(res);
            }
        });
    } catch (error) {
        res.end(Date.now());
    }
    return;
});

module.exports = ssrServer;
