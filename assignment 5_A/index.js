
javascript
const express = require("express");

const app = express();
app.use(express.json());

let students = [
  { id: 1, name: "Aarav", marks: 85 },
  { id: 2, name: "Sneha", marks: 90 }
];

// Get all students
app.get("/students", (req, res) => {
  res.json(students);
});

// Add a new student
app.post("/students", (req, res) => {
  students.push(req.body);
  res.send("New student added successfully");
});

// Update student details
app.put("/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const student = students.find(s => s.id === id);

  if (student) {
    student.name = req.body.name;
    student.marks = req.body.marks;
    res.send("Student details updated successfully");
  } else {
    res.send("Student not found");
  }
});

// Delete a student
app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = students.some(s => s.id === id);

  if (exists) {
    students = students.filter(s => s.id !== id);
    res.send("Student deleted successfully");
  } else {
    res.send("Student not found");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
