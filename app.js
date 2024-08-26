const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const cors = require("cors");

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    const app = express();

    // Middleware
    app.use(cors()); // Enable Cross-Origin Resource Sharing
    app.use(express.json()); // For parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

    // Routes
    app.use('/api', routes);

    // Start the server
    app.listen(3003, () => {
        console.log("App is running on http://127.0.0.1:3003");
    });
})
.catch(error => {
    console.error("Error connecting to MongoDB:", error);
});
