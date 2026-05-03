export const scoreSwagger = {
  paths: {

    "/score": {
      post: {
        summary: "Add score",
        tags: ["Score"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["user_id", "challenge_id", "submission_id", "score"],
                properties: {
                  user_id: {
                    type: "string",
                    example: "64f123abc"
                  },
                  challenge_id: {
                    type: "string",
                    example: "64f456def"
                  },
                  submission_id: {
                    type: "string",
                    example: "64f789ghi"
                  },
                  score: {
                    type: "number",
                    example: 95
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Score added successfully" },
          409: { description: "Duplicate score for submission" }
        }
      }
    },

    "/score/{id}": {
      patch: {
        summary: "Update score",
        tags: ["Score"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["score"],
                properties: {
                  score: {
                    type: "number",
                    example: 100
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Score updated successfully" },
          404: { description: "Score not found" }
        }
      }
    },

    "/score/submission/{submissionId}": {
      get: {
        summary: "Get score by submission",
        tags: ["Score"],
        parameters: [
          {
            in: "path",
            name: "submissionId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Score retrieved" },
          404: { description: "No score found" }
        }
      }
    },

    "/score/user/{userId}": {
      get: {
        summary: "Get all scores for a user",
        tags: ["Score"],
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "User scores retrieved" }
        }
      }
    },

    "/score/challenge/{challengeId}": {
      get: {
        summary: "Get scores for a challenge (Leaderboard)",
        tags: ["Score"],
        parameters: [
          {
            in: "path",
            name: "challengeId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Challenge leaderboard retrieved" }
        }
      }
    }

  }
};