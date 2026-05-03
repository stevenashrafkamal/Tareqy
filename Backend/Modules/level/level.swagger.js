export const levelSwagger = {
  paths: {

    "/level": {
      post: {
        summary: "Create level",
        tags: ["Level"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["track_id"],
                properties: {
                  track_id: {
                    type: "string",
                    example: "64f123abc"
                  },
                  level_number: {
                    type: "number",
                    example: 1
                  },
                  level_difficulty: {
                    type: "string",
                    example: "easy"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Level created successfully" },
          400: { description: "Level already exists" },
          404: { description: "Track not found" }
        }
      }
    },

    "/level/track/{trackId}": {
      get: {
        summary: "Get levels by track",
        tags: ["Level"],
        parameters: [
          {
            in: "path",
            name: "trackId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Levels retrieved" }
        }
      }
    },

    "/level/{id}": {
      get: {
        summary: "Get level by ID",
        tags: ["Level"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Level retrieved" },
          404: { description: "Level not found" }
        }
      },

      put: {
        summary: "Update level",
        tags: ["Level"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  level_number: { type: "number" },
                  level_difficulty: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Level updated successfully" },
          400: { description: "Level number already exists" },
          404: { description: "Level not found" }
        }
      },

      delete: {
        summary: "Delete level (and its steps)",
        tags: ["Level"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Level deleted successfully" },
          404: { description: "Level not found" }
        }
      }
    },

    "/level/{levelId}/steps": {
      get: {
        summary: "Get steps of a level",
        tags: ["Level"],
        parameters: [
          {
            in: "path",
            name: "levelId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Steps retrieved" },
          404: { description: "Level not found" }
        }
      }
    }

  }
};