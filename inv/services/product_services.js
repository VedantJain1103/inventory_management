const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { use } = require('../routes/accounts');
const uri = "mongodb+srv://vedant:vedant@inventorymangement.aculpi8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("InventoryManagement");
const Users = database.collection("Users");
const Sessions = database.collection("Sessions");
const Categories = database.collection("Categories");
const Products = database.collection("Products");

async function addProduct(username, name, category, price, description) {
    try {
        const newProduct = {
            username: username,
            name: name,
            category: category,
            price: price,
            description: description
        };
        const categoryQuery = {
            username: username,
            name: category
        };
        const categoryOption = {
            projection: { _id: 0 }
        };
        const categoryResult = await Categories.findOne(categoryQuery, categoryOption);
        console.log(categoryResult);
        if (categoryResult == null) {
            const newCategory = {
                username: username,
                name: category
            }
            const categoryCreated = await Categories.insertOne(newCategory);
        }
        const result = await Products.insertOne(newProduct);
        console.log(newProduct);
    } catch (err) {
        throw err;
    }
}

async function updateProduct(id, name, category, price, description, username) {
    try {
        const filter = {
            _id: ObjectId(id)
        }
        const upd = {
            $set: {
                name: name,
                category: category,
                price: price,
                description: description
            }
        }
        const result = await Products.updateOne(filter, upd);
        const cat = await Categories.findOne({ username: username, name: category });
        if (!cat) {
            await Categories.insertOne({ username: username, name: category });
        }
        // console.log(result);
    } catch (err) {
        throw err;
    }
}

async function deleteProduct(id) {
    try {
        const deleteQuery = {
            _id: ObjectId(id)
        }
        const del = await Products.deleteOne(deleteQuery);
    } catch (err) {
        throw err;
    }
}

async function listProduct(username) {
    try {
        const query = {
            username: username
        }
        const option = {
            projection: { _id: 1, username: 1, name: 1, category: 1, price: 1, description: 1 }
        }
        const listProducts = Products.find(query, option);
        let products = [];
        await listProducts.forEach(add);
        function add(item) {
            products.push(item)
        }
        return products;
    } catch (err) {
        throw err;
    }
}
async function getProduct(id) {
    try {
        const query = {
            _id: ObjectId(id)
        }
        const option = {
            projection: { _id: 1, name: 1, category: 1, price: 1, description: 1 }
        }
        const product = Products.findOne(query, option);
        return product;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    listProduct,
    getProduct,
}