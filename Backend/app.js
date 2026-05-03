import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { gerror } from "./Middlewares/gerror.js";
import { swaggerUi } from "./config/swagger.js";
import { userRouter } from "./Modules/users/users.router.js";
import { scoresRouter } from "./Modules/scores/scores.router.js";
import { feedbackRouter } from "./Modules/feedback/feedback.router.js";
import challengeRouter from "./Modules/challenge/challenge.routes.js";
import codeReviewerRouter from "./Modules/codeReviewer/codeReviewer.routes.js";
import submissionRouter from "./Modules/submission/submission.routes.js";
import trackRouter from "./Modules/track/track.routes.js";
import levelRouter from "./Modules/level/level.routes.js";
import checkPointRouter from "./Modules/checkpoint/checkpoint.routes.js";
import adminRouter from "./Modules/admin/admin.route.js";
import { swaggerDocs } from "./docs/swagger.js";
import stepRouter from "./Modules/step/step.router.js";
import instructorRouter from "./Modules/instructor/instructor.router.js";
import taskRouter from "./Modules/task/task.router.js";
import reviewRouter from "./Modules/feedback/review/review.route.js";
import reportRouter from "./Modules/feedback/report/report.route.js";
import resourcesRouter from "./Modules/resources/resources.router.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// ── CORS Configuration ──────────────────────────────────────────────────────
// Whitelist of origins allowed to make cross-origin requests.
const ALLOWED_ORIGINS = [
  'http://localhost:4200',      // Angular dev server
  'http://localhost:3000',      // Local fallback
  'https://tareqy.com',         // Production domain (change to your real domain)
  'https://www.tareqy.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any localhost port during development, or specified production domains
      const isLocal = origin && /^http:\/\/localhost:\d+$/.test(origin);
      if (!origin || isLocal || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' is not allowed`));
      }
    },
    credentials: true,          // Allow Authorization header & cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,  // Some legacy browsers choke on 204
  })
);
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", userRouter);
app.use("/scores", scoresRouter);
app.use("/feedback", feedbackRouter);
app.use("/api/reviewer", codeReviewerRouter);
app.use("/api/challenge", challengeRouter);
app.use("/api/submission", submissionRouter);
app.use("/api/track", trackRouter);
app.use("/api/level", levelRouter);
app.use("/api/checkpoint", checkPointRouter);
app.use("/api/admin", adminRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/steps", stepRouter);
app.use("/api/instructors", instructorRouter);
app.use("/api/tasks", taskRouter);

// ── Feedback Sub-modules (Reviews & Reports) ─────────────────────────────────
app.use("/api/reviews",   reviewRouter);
app.use("/api/reports",   reportRouter);

// ── Resources ────────────────────────────────────────────────────────────────
app.use("/api/resources", resourcesRouter);


app.use(gerror);

export default app;