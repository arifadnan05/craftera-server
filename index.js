const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://craftera-29a5a.web.app", "https://craftera-29a5a.firebaseapp.com"]
  })
)
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8lcgwxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const userCollection = client.db('userDB').collection('user')
    const craftItemCollection = client.db('userDB').collection('craft-item')
    const homeCardCollection = client.db('userDB').collection('art-craft-card')


    // user adding api
    app.post('/user', async (req, res) => {
      const user = req.body;
      // console.log(user)
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // all craft item api
    app.post('/craft-item', async (req, res) => {
      const user = req.body;
      // console.log(user)
      const result = await craftItemCollection.insertOne(user)
      res.send(result)
    })

    app.get('/craft-item', async (req, res) => {
      const cursor = craftItemCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/category/:subCategory', async (req, res) => {
      const result = await craftItemCollection.find({ subCategory: req.params.subCategory }).toArray();
      res.send(result)
    })



    app.get('/art-craft-card', async (req, res) => {
      const cursor = homeCardCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // dynamic craft my list
    app.get('/craft-item/:email', async (req, res) => {
      const result = await craftItemCollection.find({ userEmail: req.params.email }).toArray();
      res.send(result)
    })


    // Update my list item 
    app.get('/craftitem/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftItemCollection.findOne(query);
      res.send(result)
    })


    app.put('/craftitem/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraftItem = req.body;
      const items = {
        $set: {

          item_name: updatedCraftItem.item_name,
          subcategory_name: updatedCraftItem.subcategory_name,
          price: updatedCraftItem.price,
          processing_time: updatedCraftItem.processing_time,
          rating: updatedCraftItem.rating,
          customization: updatedCraftItem.customization,
          stockStatus: updatedCraftItem.stockStatus,
          short_description: updatedCraftItem.short_description,
          photo: updatedCraftItem.photo,
        }
      }
      const result = await craftItemCollection.updateOne(filter, items, options);
      res.send(result)
    })


    // Delete my craft items
    app.delete('/craft-item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftItemCollection.deleteOne(query);
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.get('/', (req, res) => {
  res.send('Server Was running.......')
})

app.listen(port, () => {
  console.log(`Server in running ${port}`)
})
