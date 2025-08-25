import { Global, Module} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Global()
@Module({
    providers: [
        {
            provide: 'FIREBASE_ADMIN',
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                if (!admin.apps.length) {
                    const credential = admin.credential.cert({
                        projectId: config.get<string>('FIREBASE_PROJECT_ID'),
                        clientEmail: config.get<string>('FIREBASE_CLIENT_EMAIL'),
                        privateKey: config.get<string>('FIREBASE_PRIVATE_KEY')
                        ?.replace(/\\n/g, '\n'),
                    } as admin.ServiceAccount);
                    admin.initializeApp({ credential });
                }
                return admin;
            },
        },
    ],
    exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}