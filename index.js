const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const Memo = require("./models/memo");

mongoose
  .connect("mongodb://127.0.0.1:27017/memo-app-node")
  .then(() => {
    console.log("Mongo Connection open!!!");
  })
  .catch((err) => {
    console.log("Mongo Connection Error!!!");
    console.log(err);
  });

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["home", "work", "friend", "personal"];

app.get("/memos", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const memos = await Memo.find({ category });
    res.render("memos/index", { memos, category });
  } else {
    const memos = await Memo.find({});
    res.render("memos/index", { memos, category: "All" });
  }
});

app.get("/memos/new", (req, res) => {
  res.render("memos/new", { categories });
});

app.post("/memos", async (req, res) => {
  const newMemo = new Memo(req.body);
  await newMemo.save();
  // console.log(newMemo);
  res.redirect(`/memos/${newMemo._id}`);
});

app.get("/memos/:id", async (req, res) => {
  const { id } = req.params;
  const memo = await Memo.findById(id);
  res.render("memos/show", { memo });
});

app.get("/memos/:id/edit", async (req, res) => {
  const { id } = req.params;
  const memo = await Memo.findById(id);
  res.render("memos/edit", { memo, categories });
});

app.put("/memos/:id", async (req, res) => {
  const { id } = req.params;
  const memo = await Memo.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/memos/${memo._id}`);
});

app.delete("/memos/:id", async (req, res) => {
  const { id } = req.params;
  const deletedMemo = await Memo.findByIdAndDelete(id);
  res.redirect("/memos");
});

// app.listen(3000, () => {
//   console.log("Listening on port 3000");
// });

// create HTTPS server
let key = fs.readFileSync(__dirname + "/memo.key", "utf-8");
let cert = fs.readFileSync(__dirname + "/memo.crt", "utf-8");

const parameters = {
  key: key,
  cert: cert,
};

let httpsServer = https.createServer(parameters, app);

httpsServer.listen(3001, () => {
  console.log("HTTPS server listening on port 3001");
});
