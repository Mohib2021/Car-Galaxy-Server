const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri =
	"mongodb+srv://Mohib:Mohib@cluster0.nr9ns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const run = async () => {
	await client.connect();
	const database = client.db("car-show");
	const carCollection = database.collection("cars");
	try {
		app.get("/cars", async (req, res) => {
			const cursor = carCollection.find({});
			const result = await cursor.toArray();
			res.send(result);
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
