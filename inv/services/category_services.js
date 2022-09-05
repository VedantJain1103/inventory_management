const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { use } = require('../routes/accounts');
const uri = "mongodb+srv://vedant:vedant@inventorymangement.aculpi8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("InventoryManagement");
const Users = database.collection("Users");
const Sessions = database.collection("Sessions");
const Categories = database.collection("Categories");
const Products = database.collection("Products");

async function listCategory(username) {
    try {
        const query = {
            username: username
        }
        const option = {
            projection: { _id: 1, username: 1, category: 1, }
        }
        const listCategory = Categories.find(query);
        let categories = [];
        await listCategory.forEach(add);
        function add(item) {
            categories.push(item)
        }
        return categories;
    } catch (err) {
        throw err;
    }
}

async function getProductByCategory(username, category) {
    try {
        const query = {
            username: username,
            category: category
        }
        const listProducts = Products.find(query);
        let products = [];
        await listProducts.forEach(add);
        function add(item) {
            products.push(item);
        }
        return products;
    } catch (err) {
        throw err;
    }
}
async function getCategory(id) {
    try {
        const query = {
            _id: ObjectId(id)
        };
        const category = Categories.findOne(query);
        return category;
    } catch (err) {
        throw err;
    }
}

async function updateCategory(id, username, cname, description) {
    try {
        const query = {
            _id: ObjectId(id)
        };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                name: cname,
                description: description
            },
        };
        const result = await Categories.updateOne(query, updateDoc, options);
    } catch (err) {
        throw err;
    }
}
async function updateInProducts(id, username, cname) {
    try {

        const query2 = {
            username: username,
            category: cname
        };
        const updateDoc2 = {
            $set: {
                category: cname,
            },
        };
        const result2 = await Products.updateMany(query2, updateDoc2);
    } catch (err) {
        throw err;
    }
}

async function deleteCategory(id, username, cname) {
    try {
        const query = {
            _id: ObjectId(id)
        };
        const query2 = {
            username: username,
            category: cname
        };
        const result2 = await Products.deleteMany(query2);
        const result = await Categories.deleteOne(query);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    listCategory,
    getProductByCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    updateInProducts
};