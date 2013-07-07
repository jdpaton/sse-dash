define(['text!./awesome.hbs'], function(template) {
  return {

    updateFeed: function(feeds) {
      var f = JSON.parse(feeds);
      this.$el.find("#feed-title").text(f.title);
      this.$el.find("#feed-desc").text(f.description);
      this.$el.find("#feed-author").text(f.author);
      this.$el.find("#feed-date").text(f.date);
    },
    initialize: function() {

      this.html(template);
      var self = this;

      var button = this.$el.find("#connect-feed");
      var button_cont = this.$el.find("#cf-parent");
      var status = this.$el.find("#statusfeed");
      var source2;

      function connect() {
        source2 = new EventSource("stream/feed");

        source2.addEventListener("feed", function(event) {
          self.updateFeed(event.data);
        }, false);

        source2.addEventListener("open", function(event) {
          button.text("Disconnect");
          button.click( function(event) {
            source2.close();
            button.text("Connect");
            button.click(connect);
            status.text("Connection closed!");
          });
          button_cont.removeClass("warning");
          status.text("Connection open!");
        }, false);

        source2.addEventListener("error", function(event) {
          button_cont.addClass("warning");
          if (event.target.readyState === EventSource.CLOSED) {
            source2.close();
            status.text("Connection closed!");
          } else if (event.target.readyState === EventSource.CONNECTING) {
            status.text("Connection closed. Attempting to reconnect!");
          } else {
            status.text("Connection closed. Unknown error!");
          }
        }, false);
      }

      if (!!window.EventSource) {
        connect();
      } else {
        button.style.display = "none";
        status.text("Sorry, your browser doesn't support server-sent events");
      }

    }
  };
});
