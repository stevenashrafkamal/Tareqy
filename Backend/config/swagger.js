import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "Authentication system API with signup, login, refresh tokens, and email verification"
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local server"
      }
    ]
  },
  apis: ["./src/modules/auth/*.js"] 
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };