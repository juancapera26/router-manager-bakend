import * as admin from 'firebase-admin';

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error(
    'No se encontró FIREBASE_SERVICE_ACCOUNT en las variables de entorno'
  );
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log('Firebase: usando variable de entorno');
} catch (err) {
  console.error('Error al parsear FIREBASE_SERVICE_ACCOUNT:', err);
  throw err;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export {admin};
