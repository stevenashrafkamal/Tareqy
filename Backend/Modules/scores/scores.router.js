import { Router } from "express";
import {
    addScore,
    updateScore,
    getScoreBySubmission,
    getUserScores,
    getChallengeScores,
} from "./scores.controller.js";
import { validate } from "../../Middlewares/validate.js";
import { addScoreValidation, updateScoreValidation } from "../../validation/score.validation.js";
import { checkToken } from "../../Middlewares/checkToken.js";
import { checkAdmin } from "../../Middlewares/checkAdmin.js";

export const scoresRouter = Router();

scoresRouter.post("/", checkToken, checkAdmin, validate(addScoreValidation), addScore);
scoresRouter.put("/:id", checkToken, checkAdmin, validate(updateScoreValidation), updateScore);
scoresRouter.get("/submission/:submissionId", checkToken, getScoreBySubmission);
scoresRouter.get("/user/:userId", checkToken, getUserScores);
scoresRouter.get("/challenge/:challengeId", checkToken, getChallengeScores);
