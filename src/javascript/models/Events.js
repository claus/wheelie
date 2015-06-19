module.exports = function(mongoose) {

    var Schema = mongoose.Schema;

    var eventsSchema = new Schema({
            createdAt: Date,
            userAgent: String,
            events: [{
                x: Number,
                y: Number,
                z: Number,
                mode: Number,
                time: Number
            }]
        },{
            toObject: { getters: true }
        });

    eventsSchema.virtual('createdAtNum').get(function() {
      return this.createdAt.getTime();
    });

    eventsSchema.index({ createdAt: 1 });

    return mongoose.model("Events", eventsSchema);
};
