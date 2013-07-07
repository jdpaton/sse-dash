define(['components/aura/lib/aura'], function(Aura) {
  Aura()
    .use('extensions/sse-feed')
    .use('extensions/sse-date')
    .use('extensions/sse-peers')
    .start({ widgets: 'body' }).then(function() {
      console.warn('Aura started...');
    });
});
