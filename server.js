var express = require('express'),
    app = express(),
    feeds = require('./lib/feed'),
    sse = require('./lib/sse'),
    peer_ips = [],
    articles = [];

feeds.startUpdater()
feeds.on('article', function(article) {
    articles.push(article);
    if (articles.length > 5) {
        articles.slice(0, 5)
    }
});


app.get('/', function(req, res) {
    res.sendfile('./web/app/index.html');
});

app.get('/web/*', function(req, res) {
    path = req.params[0] ? req.params[0] : 'index.html';
    res.sendfile('./web/app/' + path);
});

app.get('/stream/peers', function(req, res) {
    var event = 'peers';
    var peer_ip = req.connection.remoteAddress;
    var peer_port = req.connection.remotePort;

    if (req.headers['x-real-ip']) {
        peer_ip = req.headers['x-real-ip']
    };

    peer_ips.push([peer_ip, peer_port, req.headers['user-agent']]);
    console.log('Added peer: ' + peer_ip + ':' + peer_port);

    sse.writeSSEHead(req, res, function(req, res) {
        sse.writeSSEData(req, res, event, peer_ips, function(req, res) {

            interval = setInterval(function() {
                sse.writeSSEData(req, res, event, peer_ips);
            }, 1000);

            req.connection.addListener("close", function() {
                clearInterval(interval);
                for (var peer in peer_ips) {
                    if (peer_ips[peer][0] === peer_ip && peer_ips[peer][1] === peer_port) {
                        peer_ips.splice(peer, 1);
                        console.log('Removed peer: ' + peer_ip + ':' + peer_port);
                    };
                }
            });
        });
    });

});

app.get('/stream/feed', function(req, res) {
    var event = 'feed';

    sse.writeSSEHead(req, res, function(req, res) {
        sse.writeSSEData(req, res, event, articles[articles.length - 1], function(req, res) {

            interval = setInterval(function() {
                sse.writeSSEData(req, res, event, articles[articles.length - 1]);
            }, 1000);

            req.connection.addListener("close", function() {
                clearInterval(interval);
            });

        })
    });
});

app.get('/stream/date', function(req, res) {

    var event = 'date';

    sse.writeSSEHead(req, res, function(req, res) {
      sse.writeSSEData(req, res, event, new Date(), function(req, res) {

        intervalx = setInterval(function() {
          sse.writeSSEData(req, res, event, new Date());
        }, 1000);

        req.connection.addListener("close", function() {
            clearInterval(intervalx);
        });
      });
    });
});

app.listen(process.env.PORT || 3000);
