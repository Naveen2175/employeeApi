const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const empRoutes = require("./employees");

const app = express();
const PORT = process.env.PORT || 3000;

/* serve static frontend ( public/index.html and assets) */
app.use(express.static("public"));

app.use(bodyParser.json());

/* employee API routes */
app.use("/api", empRoutes);

/* Swagger docs */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* fallback - hits only if no static file matches */
app.get("/", (req, res) => {
  res.send("API is working ");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
