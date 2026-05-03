export const challengeSwagger = {
  paths: {
    "/challenge": {
      post: {
        summary: "Create a new challenge",
        tags: ["Challenge"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["track_id", "level_id", "step_id", "content"],
                properties: {
                  track_id: { type: "string", example: "64f123abc" },
                  level_id: { type: "string", example: "64f456def" },
                  step_id: { type: "string", example: "64f789ghi" },
                  content: { type: "string", example: "Solve this problem" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Challenge created successfully" },
          500: { description: "Server error" }
        }
      }
    },

    "/challenge/{id}": {
      get: {
        summary: "Get challenge by ID",
        tags: ["Challenge"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Challenge retrieved" },
          404: { description: "Challenge not found" }
        }
      },

      put: {
        summary: "Update challenge",
        tags: ["Challenge"],
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
                properties: {
                  content: { type: "string" },
                  reviewer_id: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Challenge updated successfully" },
          404: { description: "Challenge not found" }
        }
      },

      delete: {
        summary: "Delete challenge",
        tags: ["Challenge"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Challenge deleted successfully" },
          404: { description: "Challenge not found" }
        }
      }
    },

    "/challenge/track/{trackId}": {
      get: {
        summary: "Get challenges by track",
        tags: ["Challenge"],
        parameters: [
          {
            in: "path",
            name: "trackId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "List of challenges" }
        }
      }
    },

    "/challenge/level/{levelId}": {
      get: {
        summary: "Get challenges by level",
        tags: ["Challenge"],
        parameters: [
          {
            in: "path",
            name: "levelId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "List of challenges" }
        }
      }
    },

    "/challenge/step/{stepId}": {
      get: {
        summary: "Get challenges by step",
        tags: ["Challenge"],
        parameters: [
          {
            in: "path",
            name: "stepId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "List of challenges" }
        }
      }
    },

    "/challenge/{id}/assign-reviewer": {
      patch: {
        summary: "Assign reviewer",
        tags: ["Challenge"],
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
                required: ["reviewer_id"],
                properties: {
                  reviewer_id: { type: "string", example: "64fabcd123" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Reviewer assigned successfully" },
          404: { description: "Challenge not found" }
        }
      }
    }
  }
};