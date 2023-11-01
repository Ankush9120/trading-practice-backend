const { MongoClient } = require('mongodb');

const express = require('express');
var cors = require('cors');
const dotenv = require("dotenv").config();
const app = express();

app.use(cors());

const uri = `mongodb+srv://Ankush9120:${process.env.KEY}@cluster0.9tcj5v0.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri);

const dbConnection = async () => {
    try {
        await client.connect();
        const db = client.db("stock")
        const collection = db.collection("stockData")
        const data = await collection.find().toArray();
        return data;

    } finally {
        await client.close();
    }

}

app.get("/api/getStockData", async (req, res) => {
    try {
        const data = await dbConnection();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
