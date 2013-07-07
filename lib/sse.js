module.exports.writeSSEHead = function (req, res, cb) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
    res.write("retry: 10000\n");
    return cb(req, res);
}

module.exports.writeSSEData = function (req, res, event, data, cb) {
    var id = (new Date()).toLocaleTimeString();
    res.write("id: " + id + '\n');
    res.write("event: " + event + "\n");
    res.write("data: " + JSON.stringify(data) + "\n\n");
    if (cb) {
        return cb(req, res);
    }
};
