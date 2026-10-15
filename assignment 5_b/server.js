
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

// Local MongoDB connection
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let students;

// Connect to MongoDB
async function connectDB() {
  await client.connect();

  console.log("MongoDB connected successfully");

  const db = client.db("college");
  students = db.collection("students");
}

// GET - Display all students
app.get("/students", async (req, res) => {
  const data = await students.find().toArray();
  res.json(data);
});

// POST - Add a new student
app.post("/students", async (req, res) => {
  await students.insertOne(req.body);
  res.send("Student added successfully");
});

// PUT - Update a student
app.put("/students/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);

  const result = await students.updateOne(
    { _id: id },
    {
      $set: {
        name: req.body.name,
        marks: req.body.marks
      }
    }
  );

  if (result.matchedCount > 0) {
    res.send("Student updated successfully");
  } else {
    res.send("Student not found");
  }
});

// DELETE - Delete a student
app.delete("/students/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);

  const result = await students.deleteOne({
    _id: id
  });

  if (result.deletedCount > 0) {
    res.send("Student deleted successfully");
  } else {
    res.send("Student not found");
  }
});

// Start server
async function startServer() {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer();
