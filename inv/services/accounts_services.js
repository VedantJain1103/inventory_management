// const Users = require('../model/User');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://vedant:vedant@inventorymangement.aculpi8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db("InventoryManagement");
const Users = database.collection("Users");
const Sessions = database.collection("Sessions");

async function updateUser(userName, email, password) {
    try {
        const user = Users.findOne({ username: userName });
        if (password) {
            if (user.password == password) return "changePass";
            const upd = Users.updateOne({ username: userName }, { $set: { email: email, password: password } });
        }
        else {
            const upd = Users.updateOne({ username: userName }, { $set: { email: email } });
        }
    } catch (err) {
        throw (err);
    }
}

async function deleteUser(userName) {
    try {
        await Users.findByIdAndDelete(
            userName,
        )
    } catch (err) {
        next(err);
    }
}

async function getUser(userName) {
    try {
        const query = { username: userName };
        const options = {
            projection: { _id: 1, username: 1, email: 1, password: 1 },
        };
        const user = await Users.findOne(query, options);
        return user;
    } catch (err) {
        res.status(500).json(err);
    }
}

async function createUser(userName, email, password) {
    try {
        const q1 = await Users.findOne({ username: userName });
        const q2 = await Users.findOne({ email: email });
        if (q1 || q2) {
            return "Email or Username already exists";
        }
        const result = await Users.insertOne({ username: userName, email: email, password: password });
        console.log(result);
    } catch (err) {
        throw (err);
    }
}
async function signIn(userName, password) {
    try {
        const query = { username: userName, password: password };
        const options = {
            projection: { _id: 1, username: 1, email: 1, password: 1 },
        };
        const query2 = { username: userName };
        const options2 = {
            projection: { _id: 0, username: 1 }
        };
        const user1 = await Sessions.findOne(query2, options2);
        if (user1 != null && user1.username == userName) {
            return userName;
        }
        const user = await Users.findOne(query, options);
        console.log(user);
        if (user == null) return null;
        const newSessionId = {
            username: userName
        };
        const sessionId = await Sessions.insertOne(newSessionId);
        console.log(sessionId);
        return userName;
    } catch (err) {
        throw (err);
    }
}

async function isLoggedIn(userName) {
    try {
        console.log(userName, "=============");
        const query = { username: userName };
        const options = {
            projection: { _id: 0, username: 1 }
        };
        const user = await Sessions.findOne(query, options);
        console.log("user logged in======", user);
        return user.username;
    } catch (err) {
        throw err;
    }
}

async function logOut(userName) {
    try {
        const query = { username: userName };
        const result = Sessions.deleteOne(query);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    signIn,
    isLoggedIn,
    logOut
};
