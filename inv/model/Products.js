import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new mongoose.Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Products", ProductSchema);