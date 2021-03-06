SSE Dash
========

This is a simple demo application built to demonstrate how to use [Server Sent
Events](http://www.w3.org/TR/eventsource/) (SSE)

The backend server is implemented in Node.js and the frontend is mostly using
[aura.js](http://aurajs.com) to provide isolated (and reusable!) widgets
to connect to the different SSE endpoints. The demo currently shows connected
server peers, the latest article from the NPMjs.org RSS feed and the servers 
current date & time, all in realtime.

## Install

Simply run:

    npm install .

then:

  npm start

and finally open `http://127.0.0.1:3000`.

### Or deploy to Stackato

Simply `stackato push -n`!

### Further reading on SSE:

https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events
http://www.html5rocks.com/en/tutorials/eventsource/basics/

Browser support: http://caniuse.com/eventsource

CSS framework by [Gumby](http://gumbyframework.com/)



