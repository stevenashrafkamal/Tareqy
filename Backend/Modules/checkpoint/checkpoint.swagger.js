export const checkpointSwagger = {
  paths: {
    "/checkpoint": {
      post: {
        summary: "Create or update checkpoint",
        tags: ["Checkpoint"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["track_id", "level_id", "last_step_id"],
                properties: {
                  track_id: {
                    type: "string",
                    example: "64f123abc"
                  },
                  level_id: {
                    type: "string",
                    example: "64f456def"
                  },
                  last_step_id: {
                    type: "string",
                    example: "64f789ghi"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Checkpoint saved successfully" },
          404: { description: "Track / Level / Step not found" },
          400: { description: "Invalid relation between track/level/step" },
          500: { description: "Server error" }
        }
      }
    },

    "/checkpoint/{id}": {
      put: {
        summary: "Update checkpoint",
        tags: ["Checkpoint"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  track_id: { type: "string" },
                  level_id: { type: "string" },
                  last_step_id: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Checkpoint updated successfully" },
          404: { description: "Checkpoint not found" },
          400: { description: "Invalid relation" },
          500: { description: "Server error" }
        }
      },

      delete: {
        summary: "Delete checkpoint",
        tags: ["Checkpoint"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Checkpoint deleted successfully" },
          404: { description: "Checkpoint not found" },
          500: { description: "Server error" }
        }
      }
    },

    "/checkpoint": {
      get: {
        summary: "Get user checkpoints",
        tags: ["Checkpoint"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of user checkpoints" },
          500: { description: "Server error" }
        }
      }
    },

    "/checkpoint/track/{trackId}": {
      get: {
        summary: "Get checkpoint by track for current user",
        tags: ["Checkpoint"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "trackId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Checkpoint retrieved" },
          404: { description: "Checkpoint not found" },
          500: { description: "Server error" }
        }
      }
    }
  }
};