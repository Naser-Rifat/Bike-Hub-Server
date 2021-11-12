const express = require("express");
const cors = require("cors")
const { MongoClient } = require('mongodb');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId

const port = process.env.PORT || 5000;

const app = express();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g0xoz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {

        await client.connect()
        console.log("ok")
        const database = await client.db("cycleshop");
        const cyclescollection = await database.collection("cycles");
        const ordersdatacollection = await database.collection("orders");

        app.get("/cycles", async (req, res) => {
            const query = await cyclescollection.find({});
            const result = await query.toArray();
            res.json(result);

        })
        app.get("/cycles/:id", async (req, res) => {
            const id = req.params.id
            console.log(id);

            const query = { _id: ObjectId(id) }
            console.log(query);

            const result = await cyclescollection.findOne(query);
            console.log(result);
            res.json(result);

        })
        app.post("/cycles", async (req, res) => {
            const cycle = req.body;
            console.log(cycle);
            const result = await cyclescollection.insertOne(cycle)
            console.log(result);
            res.json(result);

        })
        app.get("/orders", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await ordersdatacollection.findOne(query)
            console.log(result);
            res.json(result);

        })
        app.post("/orders", async (req, res) => {
            const order = req.body;
            console.log(order);
            const result = await ordersdatacollection.insertOne(order)
            console.log(result);
            res.json(result);

        })


    }
    finally {
        // await client.close()

    }


}
run().catch(console.dir)


app.get('/', async (req, res) => {
    res.send("server running");
})
app.listen(port, () => {
    console.log("server running at port", port);
})