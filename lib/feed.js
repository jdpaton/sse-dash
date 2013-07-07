var FeedParser = require('feedparser')
  , EventEmitter = require('events').EventEmitter
  , request = require('request');


var feed = function(){};

feed.prototype = Object.create(EventEmitter.prototype);

feed.prototype.updateFeed = function() {
    var self = this;

    request('http://registry.npmjs.org/-/rss?limit=20&descending=true')
      .pipe(new FeedParser())
      .on('error', function(error) {
        console.error(error);
      })
      .on('meta', function (meta) {
      })
      .on('readable', function () {
        var stream = this, item;
        while (item = stream.read()) {
            self.emit('article', item);
        }
      })
};

feed.prototype.startUpdater = function() {
  var self = this;
  this.feedUpdater = setInterval(function() {
    self.updateFeed();
  }, 1000*30);
  this.updateFeed();
};

feed.prototype.stopUpdater = function() {
  if(this.feedUpdater){
    clearInterval(this.feedUpdater);
  }
};

module.exports = new feed();

