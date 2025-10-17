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
      {
        url: 'https://api.ordermanagement.com/api',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Order: {
          type: 'object',
          required: ['customerName', 'customerPhone', 'pickupAddress', 'deliveryAddress', 'orderType'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the order',
              example: 1,
            },
            customerName: {
              type: 'string',
              description: 'Name of the customer',
              example: 'John Doe',
            },
            customerPhone: {
              type: 'string',
              description: 'Customer phone number',
              example: '+1234567890',
            },
            pickupAddress: {
              type: 'string',
              description: 'Address where the order should be picked up',
              example: '123 Main St, City, State 12345',
            },
            deliveryAddress: {
              type: 'string',
              description: 'Address where the order should be delivered',
              example: '456 Oak Ave, City, State 12345',
            },
            orderType: {
              type: 'string',
              enum: ['delivery', 'pickup'],
              description: 'Type of order',
              example: 'delivery',
            },
            status: {
              type: 'string',
              enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
              description: 'Current status of the order',
              example: 'pending',
            },
            assignedMasterId: {
              type: 'integer',
              nullable: true,
              description: 'ID of the assigned master',
              example: 1,
            },
            assignedMaster: {
              $ref: '#/components/schemas/Master',
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
            phone: {
              type: 'string',
              description: 'Master phone number',
              example: '+1234567890',
            },
            currentLoad: {
              type: 'integer',
              description: 'Current number of active orders',
              example: 2,
            },
            maxLoad: {
              type: 'integer',
              description: 'Maximum number of orders the master can handle',
              example: 5,
            },
            isAvailable: {
              type: 'boolean',
              description: 'Whether the master is available for new assignments',
              example: true,
            },
            location: {
              $ref: '#/components/schemas/Location',
            },
          },
        },
        Location: {
          type: 'object',
          required: ['latitude', 'longitude'],
          properties: {
            latitude: {
              type: 'number',
              format: 'double',
              description: 'Latitude coordinate',
              example: 40.7128,
            },
            longitude: {
              type: 'number',
              format: 'double',
              description: 'Longitude coordinate',
              example: -74.0060,
            },
          },
        },
        ADL: {
          type: 'object',
          required: ['orderId', 'mediaType', 'mediaUrl'],
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
            mediaType: {
              type: 'string',
              enum: ['image', 'video', 'audio'],
              description: 'Type of media',
              example: 'image',
            },
            mediaUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL to the media file',
              example: 'https://example.com/media/image.jpg',
            },
            description: {
              type: 'string',
              description: 'Optional description of the media',
              example: 'Delivery confirmation photo',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'ADL creation timestamp',
              example: '2023-12-01T11:00:00Z',
            },
          },
        },
        CreateOrderRequest: {
          type: 'object',
          required: ['customerName', 'customerPhone', 'pickupAddress', 'deliveryAddress', 'orderType'],
          properties: {
            customerName: {
              type: 'string',
              description: 'Name of the customer',
              example: 'John Doe',
            },
            customerPhone: {
              type: 'string',
              description: 'Customer phone number',
              example: '+1234567890',
            },
            pickupAddress: {
              type: 'string',
              description: 'Address where the order should be picked up',
              example: '123 Main St, City, State 12345',
            },
            deliveryAddress: {
              type: 'string',
              description: 'Address where the order should be delivered',
              example: '456 Oak Ave, City, State 12345',
            },
            orderType: {
              type: 'string',
              enum: ['delivery', 'pickup'],
              description: 'Type of order',
              example: 'delivery',
            },
          },
        },
        AttachADLRequest: {
          type: 'object',
          required: ['mediaType', 'mediaUrl'],
          properties: {
            mediaType: {
              type: 'string',
              enum: ['image', 'video', 'audio'],
              description: 'Type of media',
              example: 'image',
            },
            mediaUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL to the media file',
              example: 'https://example.com/media/image.jpg',
            },
            description: {
              type: 'string',
              description: 'Optional description of the media',
              example: 'Delivery confirmation photo',
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
