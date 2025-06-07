require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("./models/Product");

const app = express();
const config = require("./config/keys");

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

require("./routes/dialogFlowRoutes")(app);
const fulfillmentRoutes = require("./routes/fulfillmentRoutes");
app.use("/api", fulfillmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
