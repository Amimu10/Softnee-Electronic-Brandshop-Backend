const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId, } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5rlcce.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const productCollection = client.db("productDB").collection("products");
    const cartCollection = client.db("productDB").collection("carts");

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.get("/carts/:user", async (req, res) => {
      const user = req.params.user;
      const query = {
        userName: user,
      };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart)
  ;
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete", id);
      const query = {
        _id: new ObjectId(id)
  ,
      };
      const result = await cartCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });


    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/updateproducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
,
      };
      const result = await productCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = {
        brand: brand,
      };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/productDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
,
      };
      const result = await productCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.put("/updateProducts/:id", async (req, res) => {
      const id = req.params.id;
      const fliter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body; 
      const products = {
        $set: {
          image: updatedProduct.image,
          brandImage: updatedProduct.brandImage,
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          category: updatedProduct.category,
          price: updatedProduct.price,
          rating: updatedProduct.rating, 
          description: updatedProduct.description
        },
      };
      const result = await productCollection.updateOne(fliter, products, options);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" elite-electro server is running");
});

app.listen(port, () => {
  console.log(` app is running on port: ${port}`);
});

