const { MongoClient } = require('mongodb');

const express = require('express');
var cors = require('cors');
const dotenv = require("dotenv").config();
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors());
// app.use(express.json());
// app.use(cookieParser());

const uri = `mongodb+srv://Ankush9120:${process.env.KEY}@cluster0.9tcj5v0.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri);

const dbConnection = async () => {
    try {
        await client.connect();
        const db = client.db("stock")
        return db;
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
}


app.post("/api/getAllStockData", async (req, res) => {
    try {
        const db = await dbConnection();
        const data = await db.collection("stockData").find().toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await client.close();
    }
});

app.post("/api/createNewWatchlist", async (req, res) => {
    try {
        const db = await dbConnection();
        const collection = await db.collection("watchlists");
        const totalDataCount = await collection.countDocuments();

        const limit = 5;
        if (totalDataCount < limit) {
            await collection.insertOne({
                name: `List ${totalDataCount + 1}`,
                addedStocks: []
            })
            res.status(201).json({ message: "Watchlist created successfully" });
        }else{
            throw new Error(`Maximum limit is ${limit}`)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
})

app.post("/api/getWatchlist" , async (req,res)=>{
    try{
        const db = await dbConnection();
        const data = await db.collection("watchlists").find();
        res.json(data);
    }catch(error){
        console.log(error)
    }finally{
        await client.close();
    }
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
