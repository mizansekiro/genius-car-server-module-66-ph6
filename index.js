const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

//genius-car-server-module-66-ph6
//GocWlZ1HG0qfds9u
// const uri = "mongodb://127.0.0.1:27017/";

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ksgvmk5.mongodb.net/?retryWrites=true&w=majority`;

const uri =
	"mongodb+srv://genius-car-server-module-66-ph6:vUGwnBtnyrIHMMhN@cluster0.ksgvmk5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server
		await client.connect();
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);

		const servicesCollection = client.db("genius_car").collection("services");
		const orderCollection = client.db("genius_car").collection("orders");

		app.get("/services", async (req, res) => {
			const query = {};
			const cursor = servicesCollection.find(query);
			const services = await cursor.toArray();
			res.send(services);
			console.log(services);
		});

		app.get("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const service = await servicesCollection.findOne(query);

			res.send(service);
		});

		app.get("/orders", async (req, res) => {
			let query = {};
			const email = req.query.email; //eita user email jeta claint side theke pawa jabe
			if (email) {
				query = {
					email: email,
				};
			}

			const cursor = orderCollection.find(query);
			const orders = await cursor.toArray();
			res.send(orders);
			console.log(email);
		});

		app.post("/orders", async (req, res) => {
			const order = req.body;

			const result = await orderCollection.insertOne(order);
			res.send(result);
		});

		app.patch("/orders/:id", async (req, res) => {
			const id = req.params.id;
			const status = req.body.status;
			const query = { _id: new ObjectId(id) };
			const updateStatus = {
				$set: { status: status },
			};

			const result = await orderCollection.updateOne(query, updateStatus);
			res.send(result);
			console.log(status);
		});

		app.delete("/orders/:id", async (req, res) => {
			const id = req.params.id;

			const query = { _id: new ObjectId(id) };
			const result = await orderCollection.deleteOne(query);
			if (result.deletedCount === 1) {
				console.log("Successfully deleted one document.");
			} else {
				console.log("No documents matched the query. Deleted 0 documents.");
			}
			res.send(result);
		});
	} finally {
	}
}

run().catch((err) => console.error(err));

const data = [{ name: "mizan" }];

app.get("/", (req, res) => {
	res.send(data);
});

app.listen(port, (req, res) => {
	console.log("server listening from:", port);
});
