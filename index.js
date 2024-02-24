const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotEnv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const componentData = require("./dataModel.js");

dotEnv.config();

//body-parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("./public"));

//basic-route
app.get("/", (req, res) => {
  res.send(`All api's are working fine`);
});

//method : GET
//To fetch complete data
//Return complete component data
app.get("/api/data", async (req, res) => {
  try {
    const startTime = new Date();
    const sampleData = await componentData.find();
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Execution time to fetch complete data: ${executionTime}ms`)
    res.send({
      message: "Data fetched successfully",
      sampleData: sampleData,
    });
  } catch {
    res.status(400).send({
      message: "New user details failed to create",
      error: error.message,
    });
  }
});

//method: PUT
//To update value in data based on mongoDB ._id property
//Return newly updated data
app.put("/api/data/:id", async (req, res) => {
  try {
    const startTime = new Date();
    const { id } = req.params;
    const { value } = req.body;

    const updatedData = await componentData.findByIdAndUpdate(
      id,
      { $set: { value }, $inc: { count: 1 } },
      { new: true }
    );
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Execution time to update value and count: ${executionTime}ms`);

    res.status(200).json({
      message: "Data updated successfully",
      updatedData,
    });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

//method: POST
//To send value and count into components initially
//Return newly created component data
app.post("/api/data", async (req, res) => {
  try {
    const startTime = new Date();
    const { value, count } = req.body;
    const newData = new componentData({
      value,
      count,
    });
    await newData.save().then((newData) => {
      res.send({
        message: "New Data Saved successfully",
        allDetails: newData,
      });
    });
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Execution time to create new data: ${executionTime}ms`);
  } catch (error) {
    res.status(400).send({
      message: "New user details failed to create",
      error: error.message,
    });
  }
});

//connecting mongoDB server
app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Database connection failed", error);
    });
  console.log(`Server is running on port ${process.env.PORT}`);
});
