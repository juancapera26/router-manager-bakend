# Guía de Despliegue a Google Cloud Run

## Cambios Realizados

### 1. **cloudbuild.yaml**
Se agregaron las siguientes configuraciones importantes:

- `--port=8080`: Especifica el puerto explícitamente
- `--timeout=300`: Timeout de 5 minutos para las peticiones
- `--min-instances=0`: Sin instancias mínimas (para reducir costos)
- `--max-instances=10`: Máximo 10 instancias
- `--cpu=1`: 1 CPU por instancia
- `--memory=512Mi`: 512MB de RAM
- `--startup-cpu-boost`: Acelera el inicio de la aplicación

### 2. **Dockerfile**
Mejoras implementadas:

- Copia correcta de archivos de Prisma en `src/prisma`
- Agregado health check para verificar el estado de la aplicación
- Copia de `yarn.lock` para consistencia

### 3. **src/main.ts**
Mejoras en el bootstrap:

- Mejor logging con emojis para facilitar debugging
- CORS habilitado
- Manejo de errores mejorado
- Conversión explícita del puerto a número entero

### 4. **src/prisma/prisma.service.ts**
Mejoras en la conexión a la base de datos:

- Timeout de 30 segundos para la conexión
- Logging detallado de conexión/desconexión
- Mejor manejo de errores

### 5. **.dockerignore**
Nuevo archivo creado para optimizar la construcción del contenedor.

## Verificaciones Pre-Despliegue

### 1. Verificar Variables de Entorno en Secret Manager

Asegúrate de que los siguientes secretos estén configurados en Google Cloud Secret Manager:

```bash
# Listar secretos
gcloud secrets list

# Verificar que existan:
# - DATABASE_URL
# - SMTP_PASS
# - FIREBASE_CONFIG
# - GOOGLE_MAPS_API_KEY
# - FIREBASE_API_KEY
# - FIREBASE_SERVICE_ACCOUNT
```

### 2. Verificar DATABASE_URL

El formato correcto para MySQL en Cloud Run:

```
mysql://usuario:contraseña@host:puerto/nombre_base_datos?connection_limit=5
```

⚠️ **IMPORTANTE**: Si estás usando Cloud SQL, asegúrate de:

1. Usar el socket de Cloud SQL o IP pública con SSL
2. Configurar la conexión en Cloud Run:

```bash
--add-cloudsql-instances=PROYECTO:REGION:INSTANCIA
```

### 3. Formato correcto de FIREBASE_SERVICE_ACCOUNT

Debe ser un JSON minificado (una sola línea) con las credenciales:

```json
{"type":"service_account","project_id":"tu-proyecto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

## Comandos de Despliegue

### Despliegue Automático (usando Cloud Build)

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd router-manager-bakend

# 2. Trigger manual del build
gcloud builds submit --config=cloudbuild.yaml
```

### Despliegue Manual (alternativa)

```bash
# 1. Construir la imagen localmente
docker build -t gcr.io/TU-PROYECTO-ID/router-manager-backend:latest .

# 2. Subir la imagen
docker push gcr.io/TU-PROYECTO-ID/router-manager-backend:latest

# 3. Desplegar a Cloud Run
gcloud run deploy router-manager-backend \
  --image gcr.io/TU-PROYECTO-ID/router-manager-backend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port=8080 \
  --timeout=300 \
  --min-instances=0 \
  --max-instances=10 \
  --cpu=1 \
  --memory=512Mi \
  --startup-cpu-boost \
  --update-secrets=DATABASE_URL=DATABASE_URL:latest,SMTP_PASS=SMTP_PASS:latest,FIREBASE_CONFIG=FIREBASE_CONFIG:latest,GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY:latest,FIREBASE_API_KEY=FIREBASE_API_KEY:latest,FIREBASE_SERVICE_ACCOUNT=FIREBASE_SERVICE_ACCOUNT:latest
```

## Solución de Problemas

### Problema: "Container failed to start"

**Causas comunes:**

1. **Error de conexión a la base de datos**
   - Verificar DATABASE_URL
   - Verificar que Cloud SQL esté accesible
   - Verificar credenciales

2. **Puerto incorrecto**
   - ✅ Ya corregido con `--port=8080`

3. **Timeout demasiado corto**
   - ✅ Ya corregido con `--timeout=300`

4. **Memoria insuficiente**
   - ✅ Configurado en 512Mi, aumentar si es necesario

### Ver Logs en Tiempo Real

```bash
# Ver logs del servicio
gcloud run services logs read router-manager-backend \
  --region=us-central1 \
  --limit=50

# Ver logs en tiempo real
gcloud run services logs tail router-manager-backend \
  --region=us-central1
```

### Ver Logs en Cloud Console

1. Ir a: https://console.cloud.google.com/run
2. Seleccionar el servicio `router-manager-backend`
3. Click en la pestaña "LOGS"
4. Buscar mensajes con emojis:
   - 🚀 = Inicio de la aplicación
   - 🔌 = Conexión a la base de datos
   - ✅ = Éxito
   - ❌ = Error

### Conectar a Cloud SQL

Si usas Cloud SQL, agrega este flag al comando de despliegue:

```bash
--add-cloudsql-instances=TU-PROYECTO:us-central1:TU-INSTANCIA
```

Y modifica el DATABASE_URL para usar Unix socket:

```
mysql://usuario:contraseña@localhost/nombre_base_datos?socket=/cloudsql/TU-PROYECTO:us-central1:TU-INSTANCIA
```

## Testing Post-Despliegue

```bash
# 1. Obtener la URL del servicio
gcloud run services describe router-manager-backend \
  --region=us-central1 \
  --format='value(status.url)'

# 2. Hacer una petición de prueba
curl https://tu-servicio-url.run.app

# 3. Si tienes un endpoint de health check
curl https://tu-servicio-url.run.app/health
```

## Optimizaciones Adicionales

### 1. Agregar Health Check Endpoint

Crear un endpoint `/health` en tu aplicación:

```typescript
// En app.controller.ts
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

### 2. Configurar Alertas

```bash
# Crear alerta para errores
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="Cloud Run Errors" \
  --condition-display-name="Error rate" \
  --condition-threshold-value=1 \
  --condition-threshold-duration=60s
```

### 3. Aumentar Recursos si es Necesario

Si la aplicación sigue fallando, prueba aumentar recursos:

```bash
--cpu=2
--memory=1Gi
```

## Contacto y Soporte

Si después de aplicar estos cambios el problema persiste:

1. Revisa los logs con los comandos anteriores
2. Verifica que todos los secretos estén correctamente configurados
3. Verifica la conectividad a la base de datos
4. Considera usar Cloud SQL Proxy para desarrollo local

---

**Última actualización**: Octubre 2025

