define(['text!./awesome.hbs'], function(template) {
  return {

    updatePeers: function(peers) {
      peers = JSON.parse(peers);
      html = "";

      for (var peer in peers) {
        html += peers[peer][0] + ':' + peers[peer][1] + " User Agent: " +
          peers[peer][2] + "<br />";
      }

      this.$el.find("#peers").html(html);
    },
    initialize: function() {

      this.html(template);
      var self = this;

      var button = this.$el.find("#connect-peers");
      var button_cont = this.$el.find("#peers-parent");
      var status = this.$el.find("#status-peers");
      var sourcePeers;

      function connect() {
        sourcePeers = new EventSource("stream/peers");

        sourcePeers.addEventListener("peers", function(event) {
          self.updatePeers(event.data);
        }, false);

        sourcePeers.addEventListener("open", function(event) {
          button.text("Disconnect");
          button.click( function(event) {
            sourcePeers.close();
            button.text("Connect");
            button.click(connect);
            status.text("Connection closed!");
          });
          button_cont.removeClass("warning");
          status.text("Connection open!");
        }, false);

        sourcePeers.addEventListener("error", function(event) {
          button_cont.addClass("warning");
          if (event.target.readyState === EventSource.CLOSED) {
            sourcePeers.close();
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
