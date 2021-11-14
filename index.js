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
        const userdatacollection = await database.collection("users");
        const reviewerdatacollection = await database.collection("reviews");


        app.get("/cycles", async (req, res) => {
            const query = await cyclescollection.find({});
            const result = await query.toArray();
            res.json(result);

        })

        //get cycle info
        app.get("/cycles/:id", async (req, res) => {
            const id = req.params.id

            const query = { _id: ObjectId(id) }

            const result = await cyclescollection.findOne(query);
            res.json(result);

        })

        // add cycles info
        app.post("/cycles", async (req, res) => {
            const cycle = req.body;
            //  console.log(cycle);
            const result = await cyclescollection.insertOne(cycle)
            // console.log(result);
            res.json(result);

        })
        // delete an products item
        app.delete("/cycles/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            console.log(query);
            const result = await cyclescollection.deleteOne(query)
            console.log("counted", result);
            res.json(result);

        })

        //get All orders
        app.get("/orders", async (req, res) => {
            const cursor = await ordersdatacollection.find({})
            const result = await cursor.toArray()
            //    console.log(result);
            res.json(result);

        })
        //get order by email
        app.get("/orders", async (req, res) => {
            const email = req.query.email;
            //   console.log(email)
            const query = { email: email };
            //  console.log(query)
            const cursor = await ordersdatacollection.find(query)
            const result = await cursor.toArray()
            //   console.log(result);
            res.json(result);

        })


        //post a order
        app.post("/orders", async (req, res) => {
            const order = req.body;
            //  console.log(order);
            const result = await ordersdatacollection.insertOne(order)
            // console.log(result);
            res.json(result);

        })
        // delete an order item
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            console.log(query);
            const result = await ordersdatacollection.deleteOne(query)
            console.log("counted", result);
            res.json(result);

        })
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const doc = {
                $set: {
                    status: 200
                }
            }
            const result = await ordersdatacollection.updateOne(filter, doc, options)
            console.log("counted", result);
            res.json(result);

        })

        app.post("/users", async (req, res) => {
            const user = req.body;
            //    console.log(user);
            const result = await userdatacollection.insertOne(user)
            //    console.log(result);
            res.json(result);

        })
        app.put("/users", async (req, res) => {
            const user = req.body;
            //   console.log(user);
            const filter = { email: user?.email }
            const options = { upsert: true };
            const doc = { $set: user }
            const result = await userdatacollection.updateOne(filter, doc, options)
            //   console.log(result);
            res.json(result);

        })
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            //    console.log(email);
            const filter = { email: email }
            let IsAdmin = false;
            const user = await userdatacollection.findOne(filter)
            if (user?.role === 'admin') {

                IsAdmin = true;


            }
            //  console.log(user);
            res.json({ admin: IsAdmin });

        })


        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            //  console.log(user);
            const filter = { email: user?.email }
            const doc = { $set: { role: "admin" } }
            //let IsAdmin = false;
            const result = await userdatacollection.updateOne(filter, doc)
            // if (role === 'admin') {
            //     IsAdmin = true;

            // }
            //  console.log(result);
            //res.json({ admin: IsAdmin });
            res.json(result);


        })
        //add review
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            //  console.log(review);
            const result = await reviewerdatacollection.insertOne(review)

            //  console.log(result);
            res.json(result);

        })
        app.get("/reviews", async (req, res) => {
            const query = await reviewerdatacollection.find({});
            const result = await query.toArray();
            // console.log(result);
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