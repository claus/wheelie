module.exports = function(mongoose) {

    var Schema = mongoose.Schema;

    var eventsSchema = new Schema({
        createdAt: Date,
        events: [{
            x: Number,
            y: Number,
            z: Number,
            mode: Number,
            time: Number
        }]
    });

    eventsSchema.index({ createdAt: 1 });

    return mongoose.model("Events", eventsSchema);
};
