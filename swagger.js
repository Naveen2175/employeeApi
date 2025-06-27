const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee API",
      version: "1.0.0",
      description: "A simple Express Employee API with Swagger",
    },
    servers: [
      {
        url: "https://employeeapi-4pvl.onrender.com",
        description: "Live Render Server"
      }
    ]
  },
  apis: ["./employees.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
