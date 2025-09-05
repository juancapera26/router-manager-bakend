// infrastructure.module.ts
import {Module} from '@nestjs/common';
import {FirebaseAuthProvider} from './auth/firebase-auth.provider';
import {PrismaUserRepository} from './persistence/prisma/prisma-user.repository';
import {PrismaManifestRepository} from './persistence/prisma/prisma-manifest.repository';
import {PrismaService} from './persistence/prisma/prisma.service';
import {USER_REPOSITORY} from 'src/domain/users/tokens/user-repository.token';

@Module({
  providers: [
    FirebaseAuthProvider,
    {
      provide: 'AuthProvider',
      useClass: FirebaseAuthProvider
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository
    },
    PrismaUserRepository,
    PrismaManifestRepository, // << agregado
    PrismaService
  ],
  exports: [
    FirebaseAuthProvider,
    'AuthProvider',
    USER_REPOSITORY,
    PrismaManifestRepository, // << exportamos para otros módulos
    PrismaService
  ]
})
export class InfrastructureModule {}
