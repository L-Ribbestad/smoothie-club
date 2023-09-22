import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const port = 3000;
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(express.static("public"));

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();
const db = client.db("smoothie-club");
const membersCollection = db.collection("members");

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/members", async (req, res) => {
    const members = await membersCollection.find({}).toArray();
    res.render("members", { members });
});

app.get("/member/:id", async (req, res) => {
    const member = await membersCollection.findOne({ _id: new ObjectId(req.params.id) });
    res.render('member', member);
});

app.get("/members/create", (req, res) => {
    res.render("create");
});

app.post("/members/create", async (req, res) => {
    await membersCollection.insertOne(req.body);
    res.redirect("/members");
});

app.post('/member/:id', async (req, res) => {
    await membersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.redirect("/members");
  });

app.listen(port, () => console.log(`Listening on ${port}`));