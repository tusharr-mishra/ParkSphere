import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modules = [
  'auth',
  'users',
  'vehicles',
  'parking',
  'slots',
  'reservations',
  'payments',
  'notifications',
  'reviews',
  'analytics',
  'admin',
  'auditLogs',
];

const modulesDir = path.resolve(__dirname, '../src/modules');

for (const mod of modules) {
  const dir = path.join(modulesDir, mod);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // <domain>.model.js
  const modelFile = path.join(dir, `${mod}.model.js`);
  if (!fs.existsSync(modelFile)) {
    fs.writeFileSync(
      modelFile,
      `import mongoose from 'mongoose';

const ${mod}Schema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const ${mod.charAt(0).toUpperCase() + mod.slice(1)}Model =
  mongoose.models.${mod.charAt(0).toUpperCase() + mod.slice(1)} ||
  mongoose.model('${mod.charAt(0).toUpperCase() + mod.slice(1)}', ${mod}Schema);
`
    );
  }

  // <domain>.service.js
  const serviceFile = path.join(dir, `${mod}.service.js`);
  if (!fs.existsSync(serviceFile)) {
    fs.writeFileSync(
      serviceFile,
      `export const ${mod}Service = {
  getStatus: async () => ({ status: 'active', domain: '${mod}' }),
};
`
    );
  }

  // <domain>.controller.js
  const controllerFile = path.join(dir, `${mod}.controller.js`);
  if (!fs.existsSync(controllerFile)) {
    fs.writeFileSync(
      controllerFile,
      `import { sendSuccess } from '../../utils/response.js';
import { ${mod}Service } from './${mod}.service.js';

export const ${mod}Controller = {
  status: async (req, res, next) => {
    try {
      const data = await ${mod}Service.getStatus();
      return sendSuccess(res, data, '${mod} service status');
    } catch (err) {
      next(err);
    }
  },
};
`
    );
  }

  // <domain>.validation.js
  const validationFile = path.join(dir, `${mod}.validation.js`);
  if (!fs.existsSync(validationFile)) {
    fs.writeFileSync(
      validationFile,
      `import { z } from 'zod';

export const ${mod}Validation = {
  statusQuery: z.object({}).optional(),
};
`
    );
  }

  // <domain>.routes.js
  const routesFile = path.join(dir, `${mod}.routes.js`);
  if (!fs.existsSync(routesFile)) {
    fs.writeFileSync(
      routesFile,
      `import { Router } from 'express';
import { ${mod}Controller } from './${mod}.controller.js';

const router = Router();

router.get('/status', ${mod}Controller.status);

export default router;
`
    );
  }

  // <domain>.test.js
  const testFile = path.join(dir, `${mod}.test.js`);
  if (!fs.existsSync(testFile)) {
    fs.writeFileSync(
      testFile,
      `import { ${mod}Service } from './${mod}.service.js';

describe('${mod} Module', () => {
  test('should return module status', async () => {
    const res = await ${mod}Service.getStatus();
    expect(res.status).toBe('active');
    expect(res.domain).toBe('${mod}');
  });
});
`
    );
  }
}

console.log('Successfully scaffolded all 12 backend modules with required standards.');
