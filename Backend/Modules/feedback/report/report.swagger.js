export const reportSwagger = {
  paths: {

    "/report": {
      post: {
        summary: "Create report",
        tags: ["Report"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "target_type", "target_id"],
                properties: {
                  type: {
                    type: "string",
                    example: "complaint"
                  },
                  title: {
                    type: "string",
                    example: "Bug in challenge"
                  },
                  description: {
                    type: "string",
                    example: "There is an issue in step 2"
                  },
                  target_type: {
                    type: "string",
                    example: "challenge"
                  },
                  target_id: {
                    type: "string",
                    example: "64f123abc"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Report created successfully" },
          500: { description: "Server error" }
        }
      },

      get: {
        summary: "Get all reports (with filters)",
        tags: ["Admin Reports"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "status",
            schema: {
              type: "string",
              enum: ["pending", "resolved"]
            }
          },
          {
            in: "query",
            name: "relatedTo",
            schema: {
              type: "string",
              example: "challenge"
            }
          }
        ],
        responses: {
          200: { description: "Reports retrieved successfully" }
        }
      }
    },

    "/report/{id}": {
      patch: {
        summary: "Update report status",
        tags: ["Admin Reports"],
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
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["pending", "resolved"],
                    example: "resolved"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Report updated successfully" },
          400: { description: "Invalid status" },
          404: { description: "Report not found" }
        }
      }
    }

  }
};