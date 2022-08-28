const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors());
app.use(express.json());

// mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iagltqc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

/* function verifJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
} */

async function run() {
  try{
    await client.connect();
    const inventoriesCollection = client.db('Computer-Accessories-Warehouse').collection('inventories');

    // Inventories 
    app.get('/inventories', async (req, res) =>{
      const query = {};
      const cursor = inventoriesCollection.find(query);
      const inventories = await cursor.toArray();
      res.send(inventories);
    });

    app.get('/inventories/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventories = await inventoriesCollection.findOne(query);
      res.send(inventories);
  });

  }
  finally {

  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from computer accessories warehouse.');
});

app.listen(port, () => {
  console.log(`computer accessories warehouse app listening on port ${port}`);
})