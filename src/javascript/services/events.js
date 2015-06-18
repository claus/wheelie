module.exports = {

    name: 'events',

    db: null,

    read: function (req, resource, params, config, callback) {
        setTimeout(function () {
            callback(null, {});
        }, 10);
    },

    create: function (req, resource, params, body, config, callback) {
        var db = this.db;
        var events = new db.Events(body);
        events.save(function (err) {
            if (err) {
                callback('DB: error writing event', null);
                return;
            }
            db.Events.findById(events, function (err, doc) {
                if (err) {
                    callback('DB: error reading event', null);
                    return;
                }
                callback(null, doc.toObject());
            });
        });
    }

    // update: function(resource, params, body, config, callback) {},
    // delete: function(resource, params, config, callback) {}

};
