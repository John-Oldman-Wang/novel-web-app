const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const novelSchema = new Schema(
    {
        title: String,
        titleWords: [String],
        author: String,
        categorys: [String],
        category: String,
        smallCategory: String,
        shortintroduction: String,
        introduction: String,
        lastUpdateTime: Date,
        state: String,
        year: Number,
        image: String,
        heat: Number,
        href: String,
        isMale: Boolean,
        chapters: [{ type: Schema.Types.ObjectId, ref: 'chapter' }]
    },
    { timestamps: true }
);

// novelSchema.pre('save', function(next) {
//     if (this.isNew) {
//         this.meta.createAt = this.meta.updateAt = Date.now();
//     } else {
//         this.meta.updateAt = Date.now();
//     }
//     if (!this.titleWords || this.titleWords.length == 0) {
//         this.titleWords = this.title.split('');
//     }
//     if ('chapters' in this && this.chapters.length != this.chapterNumber) {
//         this.chapterNumber = this.chapters.length;
//     }
//     next();
// });

novelSchema.statics = {
    fetch: function(cb) {
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({ _id: id }).exec(cb);
    },
    findLast: function(count, cb) {
        if (typeof count == 'function') {
            cb = count;
            count = 10;
        }
        return this.find({}, { href: 0, chapters: 0, meta: 0 })
            .sort({ lastUpdateTime: -1 })
            .limit(count)
            .exec(cb);
    },
    random: function(count) {
        return this.find({})
            .skip((Math.random() * 1000) | 0)
            .limit(count);
    },
    search: function(qArray, page) {
        return Promise.all([
            this.count({
                titleWords: {
                    $all: qArray
                }
            }),
            this.find(
                {
                    titleWords: {
                        $all: qArray
                    }
                },
                {
                    href: 0,
                    chapters: 0,
                    meta: 0
                }
            )
                .skip(page * 10 - 10)
                .limit(10)
        ]).then((result) => {
            return {
                count: result[0],
                data: result[1],
                page
            };
        });
    }
};

novelSchema.virtual('chapterNumber').get(function() {
    return this.chapters.length;
});

novelSchema.virtual('base64id').get(function() {
    var base = new Buffer(this._id.toString());
    return base.toString('base64');
});

module.exports = mongoose.model('novel', novelSchema);
