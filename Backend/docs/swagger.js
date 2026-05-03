import { challengeSwagger } from "../modules/challenge/challenge.swagger.js";
import { checkpointSwagger } from "../modules/checkpoint/checkpoint.swagger.js";
import { reviewerSwagger } from "../Modules/codeReviewer/codeReviewer.swagger.js";
import { reportSwagger } from "../Modules/feedback/report/report.swagger.js";
import { reviewSwagger } from "../Modules/feedback/review/review.swagger.js";
import { levelSwagger } from "../Modules/level/level.swagger.js";
import { scoreSwagger } from "../Modules/scores/scores.swagger.js";
import { submissionSwagger } from "../Modules/submission/submission.swagger.js";
import { trackSwagger } from "../Modules/track/track.swagger.js";
import { usersSwagger } from "../Modules/users/users.swagger.js";

export const swaggerDocs = {
  openapi: "3.0.0",
  info: {
    title: "Your API",
    version: "1.0.0",
    description: "API Documentation"
  },
  servers: [
    {
      url: "http://localhost:3000/api"
    }
  ],
  paths: {
    ...challengeSwagger.paths,
    ...checkpointSwagger.paths,
    ...reviewerSwagger.paths,
    ...reportSwagger.paths,
    ...reviewSwagger.paths,
    ...levelSwagger.paths,
    ...scoreSwagger.paths,
    ...submissionSwagger.paths,
    ...trackSwagger.paths,
    ...usersSwagger.paths,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};