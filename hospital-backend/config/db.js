const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://teddy5456:Teddy2020.@cluster0.gaq08g4.mongodb.net/blogzone?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'Medicare';

let db = null;

async function connectToDatabase() {
    if (db) return db;

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await client.connect();
    db = client.db(dbName);
    return db;
}

module.exports = { connectToDatabase };
