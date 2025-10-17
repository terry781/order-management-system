import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
  openapi: '3.0.0',
  info: {
    title: 'Order Management System API',
    version: config.app.version,
    description: 'A comprehensive API for managing orders, masters, and ADL (After Delivery Live) media in an order management system.',
    contact: {
      name: 'API Support',
      email: 'support@ordermanagement.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.server.port}/api`,
      description: 'Development server',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check endpoint',
        description: 'Returns the current status of the API server',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'API is running successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    message: { type: 'string', example: 'Order Management API is running' },
                    timestamp: { type: 'string', format: 'date-time' },
                    version: { type: 'string', example: '1.0.0' },
                    environment: { type: 'string', example: 'development' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/orders': {
      get: {
        summary: 'Get all orders',
        description: 'Retrieve a list of all orders in the system',
        tags: ['Orders'],
        responses: {
          '200': {
            description: 'List of orders retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Order' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new order',
        description: 'Create a new order with customer and delivery information',
        tags: ['Orders'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Order created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
              }
            }
          }
        }
      }
    },
    '/orders/{id}': {
      get: {
        summary: 'Get order details',
        description: 'Retrieve detailed information about a specific order including assigned master and ADL media',
        tags: ['Orders'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Order ID',
            example: 1
          }
        ],
        responses: {
          '200': {
            description: 'Order details retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
              }
            }
          }
        }
      }
    },
    '/orders/{id}/assign': {
      post: {
        summary: 'Assign master to order',
        description: 'Automatically assign an available master to an order based on location and current load',
        tags: ['Orders'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Order ID',
            example: 1
          }
        ],
        responses: {
          '200': {
            description: 'Master assigned successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Master assigned successfully' },
                    master: { $ref: '#/components/schemas/Master' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/orders/{id}/adl': {
      post: {
        summary: 'Attach ADL media to order',
        description: 'Attach After Delivery Live (ADL) media to an order for delivery confirmation',
        tags: ['Orders'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Order ID',
            example: 1
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AttachADLRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'ADL media attached successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ADL' }
              }
            }
          }
        }
      }
    },
    '/orders/{id}/complete': {
      post: {
        summary: 'Complete order',
        description: 'Mark an order as completed. Requires ADL media to be attached first.',
        tags: ['Orders'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Order ID',
            example: 1
          }
        ],
        responses: {
          '200': {
            description: 'Order completed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      }
    },
    '/masters': {
      get: {
        summary: 'Get all masters with load information',
        description: 'Retrieve a list of all masters with their current load and availability status',
        tags: ['Masters'],
        responses: {
          '200': {
            description: 'List of masters retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Master' }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Order: {
        type: 'object',
        required: ['title', 'description', 'geo'],
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the order',
            example: 1,
          },
          title: {
            type: 'string',
            description: 'Order title',
            example: 'Fix plumbing issue',
          },
          description: {
            type: 'string',
            description: 'Order description',
            example: 'Kitchen sink is leaking',
          },
          status: {
            type: 'string',
            enum: ['new', 'assigned', 'inprogress', 'completed', 'rejected'],
            description: 'Current status of the order',
            example: 'new',
          },
          customerName: {
            type: 'string',
            description: 'Customer name',
            example: 'Jane Doe',
          },
          customerPhone: {
            type: 'string',
            description: 'Customer phone number',
            example: '+1-555-0123',
          },
          geo: {
            type: 'object',
            properties: {
              lat: {
                type: 'number',
                format: 'double',
                description: 'Latitude coordinate',
                example: 40.7580,
              },
              lng: {
                type: 'number',
                format: 'double',
                description: 'Longitude coordinate',
                example: -73.9855,
              },
            },
          },
          assignedMasterId: {
            type: 'integer',
            nullable: true,
            description: 'ID of the assigned master',
            example: 1,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Order creation timestamp',
            example: '2023-12-01T10:00:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2023-12-01T10:30:00Z',
          },
        },
      },
      Master: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the master',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'Name of the master',
            example: 'Master Smith',
          },
          rating: {
            type: 'number',
            format: 'double',
            minimum: 0,
            maximum: 5,
            description: 'Master rating (0-5)',
            example: 4.8,
          },
          isAvailable: {
            type: 'boolean',
            description: 'Whether the master is available',
            example: true,
          },
          geo: {
            type: 'object',
            properties: {
              lat: {
                type: 'number',
                format: 'double',
                description: 'Latitude coordinate',
                example: 40.7128,
              },
              lng: {
                type: 'number',
                format: 'double',
                description: 'Longitude coordinate',
                example: -74.0060,
              },
            },
          },
        },
      },
      ADL: {
        type: 'object',
        required: ['orderId', 'type', 'url', 'gps', 'capturedAt'],
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the ADL',
            example: 1,
          },
          orderId: {
            type: 'integer',
            description: 'ID of the associated order',
            example: 1,
          },
          type: {
            type: 'string',
            enum: ['photo', 'video'],
            description: 'Type of media',
            example: 'photo',
          },
          url: {
            type: 'string',
            format: 'uri',
            description: 'URL to the media file',
            example: 'https://example.com/media/image.jpg',
          },
          gps: {
            type: 'object',
            properties: {
              lat: {
                type: 'number',
                format: 'double',
                description: 'Latitude coordinate',
                example: 40.7580,
              },
              lng: {
                type: 'number',
                format: 'double',
                description: 'Longitude coordinate',
                example: -73.9855,
              },
            },
          },
          capturedAt: {
            type: 'string',
            format: 'date-time',
            description: 'ADL creation timestamp',
            example: '2023-12-01T11:00:00Z',
          },
        },
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['title', 'description', 'geo'],
        properties: {
          title: {
            type: 'string',
            description: 'Order title',
            example: 'Fix plumbing issue',
          },
          description: {
            type: 'string',
            description: 'Order description',
            example: 'Kitchen sink is leaking',
          },
          customerName: {
            type: 'string',
            description: 'Customer name',
            example: 'Jane Doe',
          },
          customerPhone: {
            type: 'string',
            description: 'Customer phone number',
            example: '+1-555-0123',
          },
          geo: {
            type: 'object',
            properties: {
              lat: {
                type: 'number',
                format: 'double',
                description: 'Latitude coordinate',
                example: 40.7580,
              },
              lng: {
                type: 'number',
                format: 'double',
                description: 'Longitude coordinate',
                example: -73.9855,
              },
            },
          },
        },
      },
      AttachADLRequest: {
        type: 'object',
        required: ['type', 'url', 'gps', 'capturedAt'],
        properties: {
          type: {
            type: 'string',
            enum: ['photo', 'video'],
            description: 'Type of media',
            example: 'photo',
          },
          url: {
            type: 'string',
            format: 'uri',
            description: 'URL to the media file',
            example: 'https://example.com/media/image.jpg',
          },
          gps: {
            type: 'object',
            properties: {
              lat: {
                type: 'number',
                format: 'double',
                description: 'Latitude coordinate',
                example: 40.7580,
              },
              lng: {
                type: 'number',
                format: 'double',
                description: 'Longitude coordinate',
                example: -73.9855,
              },
            },
          },
          capturedAt: {
            type: 'string',
            format: 'date-time',
            description: 'ADL creation timestamp',
            example: '2023-12-01T11:00:00Z',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Order not found',
          },
          statusCode: {
            type: 'integer',
            description: 'HTTP status code',
            example: 404,
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Error timestamp',
            example: '2023-12-01T10:00:00Z',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Success message',
            example: 'Operation completed successfully',
          },
        },
      },
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      BadRequest: {
        description: 'Bad request - validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Orders',
      description: 'Order management operations',
    },
    {
      name: 'Masters',
      description: 'Master management operations',
    },
  ],
  },
  apis: ['./src/routes/*.ts', './src/server.ts'], // paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJsdoc(options);