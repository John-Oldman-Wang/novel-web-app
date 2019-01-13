const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const chapterSchema = new Schema(
    {
        title: String,
        href: String,
        paragraphs: [String],
        novel: { type: ObjectId, ref: 'novel' },
        meta: {
            createAt: {
                type: Date,
                default: Date.now()
            },
            updateAt: {
                type: Date,
                default: Date.now()
            }
        }
    },
    { timestamps: true }
);

// chapterSchema.pre('save', function(next) {
//     if (this.isNew) {
//         this.meta.createAt = this.meta.updateAt = Date.now();
//     } else {
//         this.meta.updateAt = Date.now();
//     }

//     next();
// });

chapterSchema.statics = {
    fetch: function(cb) {
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({ _id: id }).exec(cb);
    }
};

module.exports = mongoose.model('chapter', chapterSchema);
