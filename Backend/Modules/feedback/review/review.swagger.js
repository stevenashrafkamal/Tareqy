export const reviewSwagger = {
  paths: {

    "/review": {
      post: {
        summary: "Create review",
        tags: ["Review"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["total_stars", "title", "description", "target_type", "target_id"],
                properties: {
                  total_stars: {
                    type: "number",
                    example: 5
                  },
                  title: {
                    type: "string",
                    example: "Great challenge"
                  },
                  description: {
                    type: "string",
                    example: "Very helpful and well explained"
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
          201: { description: "Review created successfully" },
          500: { description: "Server error" }
        }
      },

      get: {
        summary: "Get reviews (with filters)",
        tags: ["Review"],
        parameters: [
          {
            in: "query",
            name: "relatedTo",
            schema: {
              type: "string",
              example: "challenge"
            }
          },
          {
            in: "query",
            name: "referenceId",
            schema: {
              type: "string",
              example: "64f123abc"
            }
          }
        ],
        responses: {
          200: { description: "Reviews retrieved successfully" }
        }
      }
    },

    "/review/{id}": {
      patch: {
        summary: "Update review (only owner)",
        tags: ["Review"],
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
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  total_stars: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Review updated successfully" },
          404: { description: "Review not found or not yours" }
        }
      },

      delete: {
        summary: "Delete review",
        tags: ["Review"],
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
          200: { description: "Review deleted successfully" },
          404: { description: "Review not found" }
        }
      }
    }

  }
};