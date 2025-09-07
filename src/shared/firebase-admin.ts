// src/shared/firebase-admin.ts
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

const serviceAccountPath = join(
  process.cwd(),
  'secrets',
  'firebase-service-account.json'
);

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
  ),
});

export { admin };
