const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: mongoose.SchemaTypes.Email,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        }
    }, { timestamps: true }
)

module.exports = mongoose.model("Users", UserSchema);