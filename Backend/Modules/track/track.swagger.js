export const trackSwagger = {
  paths: {

    "/track": {
      post: {
        summary: "Create track",
        tags: ["Track"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "languages", "type"],
                properties: {
                  title: { type: "string", example: "Backend Development" },
                  description: { type: "string", example: "Learn backend fundamentals" },
                  languages: {
                    type: "array",
                    items: { type: "string" },
                    example: ["JavaScript", "Node.js"]
                  },
                  type: {
                    type: "string",
                    example: "backend"
                  },
                  compatible_tracks: {
                    type: "array",
                    items: { type: "string" },
                    example: ["64f123abc"]
                  },
                  usages: {
                    type: "string",
                    example: "for beginners"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Track created successfully" },
          400: { description: "Invalid compatible tracks" }
        }
      },

      get: {
        summary: "Get all tracks",
        tags: ["Track"],
        responses: {
          200: { description: "Tracks retrieved successfully" }
        }
      }
    },

    "/track/search": {
      get: {
        summary: "Search tracks",
        tags: ["Track"],
        parameters: [
          {
            in: "query",
            name: "title",
            schema: { type: "string" }
          },
          {
            in: "query",
            name: "type",
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Tracks found" }
        }
      }
    },

    "/track/{id}": {
      get: {
        summary: "Get track by ID",
        tags: ["Track"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Track retrieved" },
          404: { description: "Track not found" }
        }
      },

      put: {
        summary: "Update track",
        tags: ["Track"],
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
                  title: { type: "string" },
                  description: { type: "string" },
                  languages: {
                    type: "array",
                    items: { type: "string" }
                  },
                  type: { type: "string" },
                  compatible_tracks: {
                    type: "array",
                    items: { type: "string" }
                  },
                  usages: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Track updated successfully" },
          400: { description: "Invalid compatible tracks" },
          404: { description: "Track not found" }
        }
      },

      delete: {
        summary: "Delete track (and its levels)",
        tags: ["Track"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Track deleted successfully" },
          404: { description: "Track not found" }
        }
      }
    },

    "/track/{trackId}/levels": {
      get: {
        summary: "Get levels of a track",
        tags: ["Track"],
        parameters: [
          {
            in: "path",
            name: "trackId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Levels retrieved successfully" }
        }
      }
    },

    "/track/{id}/compatible": {
      get: {
        summary: "Get compatible tracks",
        tags: ["Track"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Compatible tracks retrieved" },
          404: { description: "Track not found" }
        }
      }
    },

    "/track/resources": {
      get: {
        summary: "Get track resources (placeholder)",
        tags: ["Track"],
        responses: {
          200: { description: "Coming soon" }
        }
      }
    },

    "/track/challenges": {
      get: {
        summary: "Get track challenges (placeholder)",
        tags: ["Track"],
        responses: {
          200: { description: "Coming soon" }
        }
      }
    }

  }
};