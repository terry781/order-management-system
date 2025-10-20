const fs = require('fs');
const path = require('path');

// Register TypeScript loader
require('ts-node').register({
  project: path.join(__dirname, '..', 'tsconfig.json')
});

// Import the swagger configuration
const { swaggerSpec } = require('../src/config/swagger');

// Create the output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Export the OpenAPI specification as JSON
const outputPath = path.join(outputDir, 'openapi.json');
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log('✅ OpenAPI specification exported to:', outputPath);
console.log('📄 Available at: http://localhost:3001/api-docs/openapi.json');
