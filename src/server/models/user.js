const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;
const UserSchema = new mongoose.Schema(
    {
        name: {
            unique: true,
            type: String
        },
        password: String
    },
    { timestamps: true }
);

UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    }
};

UserSchema.statics = {
    fetch: function(cb) {
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({ _id: id }).exec(cb);
    }
};

module.exports = mongoose.model('User', UserSchema);
