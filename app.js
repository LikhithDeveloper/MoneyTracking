const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const { Money, Transaction } = require("./models/money");
const { env } = require("process");
port = 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(cors());
require("dotenv").config();

// MONGO_URI = "mongodb://localhost:27017/moneytracking";

mongoose
  .connect(process.env.MONGO_UIR_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", async (req, res) => {
  const total = await Money.find();
  const trans = await Transaction.find();
  res.render("main", { total: total || { total: 0 }, trans: trans });
});
app.post("/money", async (req, res) => {
  try {
    const { total } = req.body;
    const allMoney = await Money.find();
    if (allMoney.length === 0) {
      const money = new Money({ total: total });
      await money.save();
      return res.json({ message: "Money object created", status: 200 });
    }
    return res.json({ message: "Money already exist", status: 200 });
  } catch (error) {
    return res.json(error);
  }
});

app.post("/dc", async (req, res) => {
  try {
    const { amount, reason, credit } = req.body;
    // console.log(credit);
    const trans = new Transaction({
      reason: reason,
      money: amount,
      type: credit ? "Credited" : "Debited",
    });
    trans.save();
    const total = await Money.find();
    // console.log(total);
    const id = total[0]._id;
    const curr = total[0].total;
    await Money.updateOne(
      { _id: id },
      {
        $set: {
          total: credit
            ? parseFloat(curr) + parseFloat(amount)
            : parseFloat(curr) - parseFloat(amount),
        },
      }
    );
    // console.log(id);
    res.redirect("/");
    // return res.json({ message: "Transaction Created", status: 200 });
  } catch (error) {
    return res.json({ error });
  }
});

app.get("/money", async (req, res) => {
  const allMoney = await Money.find();
  res.json({ allMoney });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is started under port: ${port}`);
});
