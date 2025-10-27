// src/@types/express/index.d.ts
import type { File } from 'multer';

declare global {
  namespace Express {
    interface MulterFile extends File {
      /** Nombre del archivo generado por Multer cuando se usa diskStorage */
      filename: string;
    }
  }
}
