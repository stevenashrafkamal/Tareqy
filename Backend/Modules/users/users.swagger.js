export const usersSwagger = {
  tags: [
    {
      name: "Users",
      description: "User Authentication & Management APIs"
    }
  ],

  paths: {
    /* ================= SIGN UP ================= */
    "/api/v1/users/signup": {
      post: {
        tags: ["Users"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "User created successfully"
          },
          400: {
            description: "Validation error"
          }
        }
      }
    },

    /* ================= SIGN IN ================= */
    "/api/v1/users/signin": {
      post: {
        tags: ["Users"],
        summary: "Login user",
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
          200: {
            description: "Login successful"
          },
          401: {
            description: "Invalid credentials"
          }
        }
      }
    },

    /* ================= VERIFY ACCOUNT ================= */
    "/api/v1/users/verify/{token}": {
      get: {
        tags: ["Users"],
        summary: "Verify user email",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          200: {
            description: "Email verified successfully"
          },
          400: {
            description: "Invalid or expired token"
          }
        }
      }
    },

    /* ================= GET ME ================= */
    "/api/v1/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user profile",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: "User data retrieved"
          },
          404: {
            description: "User not found"
          }
        }
      },

      put: {
        tags: ["Users"],
        summary: "Update current user profile",
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  email: { type: "string" },
                  old_password: { type: "string" },
                  new_password: { type: "string" },
                  confirm_password: { type: "string" },
                  Image: {
                    type: "string",
                    format: "binary"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Profile updated successfully"
          },
          400: {
            description: "Validation error"
          }
        }
      }
    },

    /* ================= GET ALL USERS ================= */
    "/api/v1/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (Admin only)",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: "List of users"
          }
        }
      }
    },

    /* ================= ADD ADMIN ================= */
    "/api/v1/users/admin": {
      post: {
        tags: ["Users"],
        summary: "Create admin user",
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Admin created successfully"
          }
        }
      }
    },

    /* ================= DELETE USER ================= */
    "/api/v1/users/{id}": {
      delete: {
        tags: ["Users"],
        summary: "Delete user by ID (Admin only)",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          200: {
            description: "User deleted successfully"
          },
          404: {
            description: "User not found"
          }
        }
      }
    }
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};