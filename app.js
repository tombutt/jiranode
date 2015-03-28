var express = require('express')
var release = require('./release.js')

var app = express()

app.get("/", function(req, res) {
    res.send('hello world')
})

app.get("/release/:project/:number", function(req, res){
    release.makeReleaseVersionRequest(req, myCallback);    
    function myCallback(body){
        res.send(body);
    }  
})

var server = app.listen(8888, function() {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
})
   

