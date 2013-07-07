define(['text!./awesome.hbs'], function(template) {
  return {

    updateDate: function(date) {
      this.$el.find("#output-date").text(date)
    },
    initialize: function() {

      this.html(template);
      var self = this;

      var button = this.$el.find("#connect-date");
      var button_cont = this.$el.find("#d-parent");
      var status = this.$el.find("#status-date");
      var output = this.$el.find("#output-date");
      var source;

      function connect() {
        source = new EventSource("stream/date");

        source.addEventListener("date", function(event) {
          self.updateDate(event.data);
        }, false);

        source.addEventListener("open", function(event) {
          button.text("Disconnect");
          button.click( function(event) {
            source.close();
            button.text("Connect");
            button.click(connect);
            status.text("Connection closed!");
          });
          button_cont.removeClass("warning");
          status.text("Connection open!");
        }, false);

        source.onerror = function(event) {
          button_cont.addClass("warning");
          if (event.target.readyState === EventSource.CLOSED) {
            source.close();
            status.text("Connection closed!");
          } else if (event.target.readyState === EventSource.CONNECTING) {
            status.text("Connection closed. Attempting to reconnect!");
          } else {
            status.text("Connection closed. Unknown error!");
          }
        };
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
