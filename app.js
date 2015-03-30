var express = require('express')
var release = require('./release.js')

var app = express()

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8888;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.get("/", function(req, res) {
    res.send('hello world')
})

app.get("/release/:project/:number", function(req, res){
    release.makeReleaseVersionRequest(req, myCallback);    
    function myCallback(body){
        res.send(body);
    }  
})

var server = app.listen(server_port, server_ip_address, function() {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
})
   

