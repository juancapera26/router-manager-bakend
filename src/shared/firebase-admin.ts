// src/shared/firebase-admin.ts
import * as admin from 'firebase-admin';
import {readFileSync} from 'fs';
import {join} from 'path';

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('Firebase: usando credenciales desde variable de entorno');
  } catch (err) {
    console.error('Error al parsear FIREBASE_SERVICE_ACCOUNT:', err);
    throw err;
  }
} else {
  // Solo para desarrollo local
  const localPath = join(
    process.cwd(),
    'secrets',
    'firebase-service-account.json'
  );
  if (existsSync(localPath)) {
    serviceAccount = JSON.parse(readFileSync(localPath, 'utf8'));
    console.log('Firebase: usando archivo local de credenciales');
  } else {
    throw new Error(
      'No se encontró FIREBASE_SERVICE_ACCOUNT ni archivo local para Firebase'
    );
  }
}

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
  )
});

export {admin};
