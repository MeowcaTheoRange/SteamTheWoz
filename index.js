const express = require("express");
const app = express();
const scott = require("./api/index");

app.use("/api", scott);
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));