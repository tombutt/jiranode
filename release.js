var http = require('http');
var https = require('https');
var url = require('url');
var cacheDuration = 5*(1000*60);

function JiraResponse(){
    this.issues = [];    
}

function JiraIssue(){
    this.key = '';
}

exports.makeReleaseVersionRequest = function (req, callback){
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";        
        var options = {
            host: 'projects.engineering.redhat.com',
            port: 443,
            path: '/rest/api/2/search?jql=project='+req.params.project+'%26fixVersion='+req.params.number,
            headers: {
                'Authorization':req.headers.authorization
            }
        };        
        var str = '';            
            https.get(options, function(res){
            res.on('data', function(chunk){
                str += chunk;
            });
            res.on('end', function() {
                if (res.statusCode === 200){
                    var jsonObj = JSON.parse(str);                
                    var responseObj = new JiraResponse();
                    for (var i = 0; i < jsonObj.issues.length; i++){                    
                        var respIssue = new JiraIssue();
                        respIssue.key = jsonObj.issues[i].key;
                        responseObj.issues.push(respIssue);
    //                    console.log("KEY:"+jsonObj.issues[i].key);
                    }
                    if (req.get('Accept') === 'application/vnd.redhat.jira+json') {
                        callback(JSON.stringify(responseObj));
                    } else {
                        callback(str); 
                    }
                } else {
                    callback("error returned from host: "+res.statusCode);
                }
            });
            res.on('error', function(e){
               callback(e.message); 
            });
        });               
}

exports.makeReleaseNotesRequest = function (req, callback){
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";        
        var options = {
            host: 'projects.engineering.redhat.com',
            port: 443,
            path: '/rest/api/2/search?jql=project='+req.params.project+'%26fixVersion='+req.params.number+'%26Labels=EMPTY%26fields=summary,issuetype',
            headers: {
                'Authorization':req.headers.authorization
            }
        };        
        var str = '';            
            https.get(options, function(res){
            res.on('data', function(chunk){
                str += chunk;
            });
            res.on('end', function() {
                if (res.statusCode === 200){
                    var jsonObj = JSON.parse(str);                
                    var responseObj = new JiraResponse();
                    for (var i = 0; i < jsonObj.issues.length; i++){                    
                        var respIssue = new JiraIssue();
                        respIssue.key = jsonObj.issues[i].key;
                        responseObj.issues.push(respIssue);
    //                    console.log("KEY:"+jsonObj.issues[i].key);
                    }
                    if (req.get('Accept') === 'application/vnd.redhat.jira+json') {
                        callback(JSON.stringify(responseObj));
                    } else {
                        callback(str); 
                    }
                } else {
                    callback("error returned from host: "+res.statusCode);
                }
            });
            res.on('error', function(e){
               callback(e.message); 
            });
        });               
}

exports.makeReleaseRequest = function (req, callback){
    if (url.parse(req.url).pathname == '/release/'){
        console.log('YES!');
        var options = {
            host: 'projects.engineering.redhat.com',
            port: 443,
            path: '/rest/api/2/version/'+req.params.number,
            headers: {
                'Authorization':req.headers.authorization
            }
        };        
        var str = '';            
            http.get(options, function(res){
            res.on('data', function(chunk){
                str += chunk;
            });
            res.on('end', function() {
//                    var jsonObj = JSON.parse(str);
                callback(str); 
            });
        });            
    } else if (url.parse(req.url).pathname == '/feedzilla/subcategories'){
        console.log('NO1!');        
        var str = '';
        if (str != null){
            console.log('got cache');
            callback(str)
        } else {
            str = '';
            http.get('http://api.feedzilla.com/v1/subcategories.json', function(res){
            res.on('data', function(chunk){
                str += chunk;
            });
            res.on('end', function() {
      //          var jsonObj = JSON.parse(str);
                callback(str); 
                });
            });     
        }
    } else {
        console.log('NO2!');        
    }
};