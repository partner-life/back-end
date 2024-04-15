const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://abdularifin6767:LPBgTgPUmfcJ5JMg@cluster0.p6qsuak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const database = client.db("weddingApp");
module.exports = database;
