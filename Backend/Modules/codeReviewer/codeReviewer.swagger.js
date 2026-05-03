export const reviewerSwagger = {
  paths: {

    "/reviewer/signup": {
      post: {
        summary: "Reviewer Signup",
        tags: ["Reviewer Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string", example: "salah" },
                  email: { type: "string", example: "test@gmail.com" },
                  password: { type: "string", example: "123456" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Reviewer registered successfully" },
          400: { description: "Email already exists" }
        }
      }
    },

    "/reviewer/login": {
      post: {
        summary: "Reviewer Login",
        tags: ["Reviewer Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Login successful" },
          404: { description: "Reviewer not found" },
          403: { description: "Not activated or suspended" }
        }
      }
    },

    "/reviewer/verify-email": {
      post: {
        summary: "Verify Reviewer Email",
        tags: ["Reviewer Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["targetId", "OTP"],
                properties: {
                  targetId: { type: "string" },
                  OTP: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Email verified successfully" },
          400: { description: "Invalid OTP" }
        }
      }
    },

    "/reviewer/profile": {
      get: {
        summary: "Get reviewer profile",
        tags: ["Reviewer Profile"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Profile retrieved" }
        }
      },

      put: {
        summary: "Update reviewer profile",
        tags: ["Reviewer Profile"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  email: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Profile updated" }
        }
      }
    },

    "/reviewer/select-track": {
      patch: {
        summary: "Select track",
        tags: ["Reviewer Settings"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  selectedTrack: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Track selected" }
        }
      }
    },

    "/reviewer/select-levels": {
      patch: {
        summary: "Select levels",
        tags: ["Reviewer Settings"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  selectedLevels: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Levels selected" }
        }
      }
    },

    "/reviewer/{id}": {
      get: {
        summary: "Get reviewer by ID",
        tags: ["Reviewer"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Reviewer found" },
          404: { description: "Not found" }
        }
      },

      delete: {
        summary: "Delete reviewer",
        tags: ["Admin"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Deleted successfully" }
        }
      }
    },

    "/reviewer/search": {
      get: {
        summary: "Search reviewers",
        tags: ["Reviewer"],
        parameters: [
          {
            in: "query",
            name: "username",
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "List of reviewers" }
        }
      }
    },

    "/reviewer/{id}/activate": {
      patch: {
        summary: "Activate reviewer",
        tags: ["Admin"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Activated" }
        }
      }
    },

    "/reviewer/{id}/deactivate": {
      patch: {
        summary: "Deactivate reviewer",
        tags: ["Admin"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Deactivated" }
        }
      }
    },

    "/reviewer/change-password": {
      patch: {
        summary: "Change password",
        tags: ["Reviewer Profile"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["old_password", "new_password"],
                properties: {
                  old_password: { type: "string" },
                  new_password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Password changed" }
        }
      }
    },

    "/reviewer/logout": {
      post: {
        summary: "Logout",
        tags: ["Reviewer Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Logged out successfully" }
        }
      }
    }

  }
};