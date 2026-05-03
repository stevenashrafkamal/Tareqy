export const submissionSwagger = {
  paths: {

    "/submission/task": {
      post: {
        summary: "Submit task",
        tags: ["Submission"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["type", "fileType", "submissionUrl"],
                properties: {
                  type: {
                    type: "string",
                    example: "task"
                  },
                  fileType: {
                    type: "string",
                    example: "pdf"
                  },
                  submissionUrl: {
                    type: "string",
                    example: "https://example.com/file.pdf"
                  },
                  challengeId: {
                    type: "string",
                    example: "64f123abc"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Submission created successfully" }
        }
      }
    },

    "/submission/challenge": {
      post: {
        summary: "Submit challenge",
        tags: ["Submission"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["type", "fileType", "submissionUrl", "challengeId"],
                properties: {
                  type: { type: "string", example: "challenge" },
                  fileType: { type: "string", example: "zip" },
                  submissionUrl: { type: "string" },
                  challengeId: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Submission created successfully" }
        }
      }
    },

    "/submission": {
      get: {
        summary: "Get user submissions",
        tags: ["Submission"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Submissions retrieved successfully" }
        }
      }
    },

    "/submission/{id}": {
      get: {
        summary: "Get submission by ID",
        tags: ["Submission"],
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
          200: { description: "Submission retrieved" },
          404: { description: "Submission not found" }
        }
      },

      delete: {
        summary: "Delete submission",
        tags: ["Submission"],
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
          200: { description: "Submission deleted successfully" },
          404: { description: "Submission not found" }
        }
      }
    },

    "/submission/challenge/{challengeId}": {
      get: {
        summary: "Get submissions by challenge",
        tags: ["Submission"],
        parameters: [
          {
            in: "path",
            name: "challengeId",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Submissions retrieved successfully" }
        }
      }
    }

  }
};