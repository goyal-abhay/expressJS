require("dotenv").config();
const express = require("express");
const port = process.env.app_PORT || 8000;
const bodyParser = require("body-parser");
const yup = require("yup");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `postgresql://${process.env.dev_user}:${process.env.dev_password}@${process.env.dev_host}:${process.env.dev_port}/${process.env.dev_database}`,
    },
  },
});

errorHandler = (err, req, res, next) => {
  res.status(500).json({ error: "Something Went Wrong" });
};

const app = express();
app.use(bodyParser.json());

const todoCheck = yup.object().shape({
  id: yup.number().required(),
  title: yup.string().required(),
  isCompleted: yup.boolean().required(),
});

app.get("/todos", async (req, res, next) => {
  try {
    const rows = await prisma.todos.findMany();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.get("/todos/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkID = await prisma.todos.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkID) {
      return res.status(404).json({ message: "not found" });
    }

    const rowData = await prisma.todos.findMany({
      where: {
        id: Number(id),
      },
    });
    res.json(rowData);
  } catch (err) {
    next(err);
  }
});

app.post("/todos", async (req, res, next) => {
  try {
    await todoCheck.validate(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const { id, title, isCompleted } = req.body;

  try {
    const newRow = await prisma.todos.create({
      data: {
        id,
        title,
        isCompleted,
      },
    });
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

app.put("/todos/:id", async (req, res, next) => {
  try {
    await todoCheck.validate(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const { id } = req.params;
  const { title, isCompleted } = req.body;

  try {
    const checkID = await prisma.todos.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!checkID) {
      return res.status(400).json({ message: "not found" });
    }

    const updatedRow = await prisma.todos.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        isCompleted,
      },
    });
    res.status(200).json(updatedRow);
  } catch (err) {
    next(err);
  }
});

app.delete("/todos/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkID = await prisma.todos.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkID) {
      return res.status(404).json({ message: "not found" });
    }

    await prisma.todos.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({ message: "success" });
  } catch (err) {
    next(err);
  }
});

app.listen(port);
console.log(`App successfully running on http://localhost:${port}`);
