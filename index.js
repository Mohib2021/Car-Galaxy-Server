const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.nr9ns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const run = async () => {
	try {
		await client.connect();
		const database = client.db("car-show");
		const carCollection = database.collection("cars");
		const orderedCollection = database.collection("ordered");
		app.get("/cars", async (req, res) => {
			const cursor = carCollection.find({});
			const result = await cursor.toArray();
			res.send(result);
		});
		// POST API
		app.post("/cars", async (req, res) => {
			const product = req.body;
			const result = await carCollection.insertOne(product);
			res.json(result);
		});
		// POST API
		app.post("/ordered", async (req, res) => {
			const order = req.body;
			const result = await orderedCollection.insertOne(order);
			res.json(result);
		});
		// GET API
		app.get("/ordered", async (req, res) => {
			const cursor = orderedCollection.find({});
			const result = await cursor.toArray();
			res.send(result);
		});

		// GET SINGLE CAR
		app.get("/cars/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await carCollection.findOne(query);
			res.send(result);
		});
		//DELETE API
		app.delete("/ordered/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = orderedCollection.deleteOne(query);
			res.json(result);
		});
	} finally {
		//something
		// app.close();
	}
};
run().catch(console.dir);
app.get("/", (req, res) => {
	res.send("car show is running");
});
app.listen(port, () => {
	console.log("car show server is running in ", port);
});
