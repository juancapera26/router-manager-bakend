import * as admin from 'firebase-admin';
import {readFileSync, existsSync} from 'fs';
import {join} from 'path';

let serviceAccount: admin.ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // ☁️ Cloud Run o secreto como variable de entorno
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('Firebase: usando credenciales desde variable de entorno');
  } catch (err) {
    console.error('Error al parsear FIREBASE_SERVICE_ACCOUNT:', err);
    throw err;
  }
} else {
  // 🖥️ Modo local: usa archivo solo si existe
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
      'No se encontró credencial de Firebase (ni archivo local ni variable de entorno FIREBASE_SERVICE_ACCOUNT)'
    );
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export {admin};
