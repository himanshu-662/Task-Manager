const router = require("express").Router();
const Task = require("../models/Task");
const verifyToken = require("../middleware/auth");

router.use(verifyToken);

// create task (admin use case)
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.send(task);
  } catch {
    res.send({ message: "error creating task" });
  }
});

// get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find().populate('projectId', 'name');
  res.send(tasks);
});

// update task (status / score)
router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.send(task);
});

module.exports = router;