import * as admin from 'firebase-admin';

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT no definido en variables de entorno'
  );
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log('Firebase: usando credenciales desde variable de entorno');
} catch (err) {
  console.error('Error al parsear FIREBASE_SERVICE_ACCOUNT:', err);
  throw err;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export {admin};
