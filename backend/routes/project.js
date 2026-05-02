const router = require("express").Router();
const Project = require("../models/Project");
const verifyToken = require("../middleware/auth");

router.use(verifyToken);

// create project (admin use case)
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.send(project);
  } catch {
    res.send({ message: "error creating project" });
  }
});

// get all projects
router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.send(projects);
});

module.exports = router;
