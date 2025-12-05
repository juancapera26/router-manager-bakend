<div align="center">

# 🚚 Router-Xpert

### Plataforma Inteligente de Gestión Logística

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0+-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
</p>

---

</div>

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Características](#-características)
- [Comenzando](#-comenzando)
- [Pre-requisitos](#-pre-requisitos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Pruebas](#-pruebas)
- [Despliegue](#-despliegue)
- [Tecnologías](#️-tecnologías)
- [Autores](#️-autores)
- [Contacto](#-contacto)

---

## 🎯 Sobre el Proyecto

**Router Manager** es una plataforma web integral diseñada para revolucionar la gestión logística. Nuestra solución permite a las empresas de paquetería optimizar sus operaciones mediante:

- 📍 **Seguimiento GPS en tiempo real**
- 🗺️ **Gestión inteligente de rutas**
- 📦 **Control centralizado de paquetes**
- 📊 **Monitoreo logístico avanzado**
- ⚡ **Optimización de tiempos de entrega**

> 💡 **Desarrollado con y para conductores:** Cada funcionalidad ha sido diseñada basándose en las necesidades reales identificadas por profesionales del sector logístico.

---

## ✨ Características

<table>
<tr>
<td width="50%">

### 👨‍💼 Para Administradores
- ✅ Gestión completa de rutas
- ✅ Creación y asignación de paquetes
- ✅ Control de flotas y conductores
- ✅ Reportes y analíticas en tiempo real
- ✅ Dashboard administrativo intuitivo

</td>
<td width="50%">

### 🚗 Para Conductores
- ✅ Visualización de rutas asignadas
- ✅ Registro de novedades en campo
- ✅ Seguimiento GPS integrado
- ✅ Actualización de estados de entrega
- ✅ Interfaz móvil optimizada

</td>
</tr>
</table>

---

## 🚀 Comenzando

### 1️⃣ Clonar el repositorio

```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/router-manager-backend.git

# Navegar al directorio
cd router-manager-backend
```

### 2️⃣ Configurar variables de entorno

```bash
# Crear archivo .env
cp .env.example .env

# Editar con tus credenciales
nano .env
```

---

## 📦 Pre-requisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

| Herramienta | Versión Mínima | Descarga |
|------------|----------------|----------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | 18.x o superior | [Descargar](https://nodejs.org/) |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) | 8.0 o superior | [Descargar](https://www.mysql.com/) |
| ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) | Última versión | [Descargar](https://git-scm.com/) |
| ![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white) | 1.22 o superior | [Descargar](https://yarnpkg.com/) |

---

## 🔧 Instalación

### Paso 1: Instalar dependencias

```bash
yarn install
```

<details>
<summary>💡 ¿Qué hace este comando?</summary>

Este comando descarga e instala todas las dependencias necesarias definidas en `package.json`, incluyendo:
- Frameworks (NestJS)
- ORMs (Prisma)
- Librerías de utilidad
- Herramientas de desarrollo

</details>

### Paso 2: Configurar base de datos

```bash
# Generar cliente de Prisma
yarn prisma generate

# Ejecutar migraciones
yarn prisma migrate deploy

# (Opcional) Sembrar datos iniciales
yarn prisma db seed
```

### Paso 3: Iniciar servidor de desarrollo

```bash
yarn start:dev
```

<div align="center">

### 🎉 ¡Listo! Tu servidor está corriendo en `http://localhost:8080`

</div>

---

## 💻 Uso

### Comandos disponibles

```bash
# Desarrollo
yarn start:dev          # Inicia el servidor en modo desarrollo
yarn start:debug        # Inicia con debugger activo

# Producción
yarn build              # Compila el proyecto
yarn start:prod         # Inicia el servidor en producción

# Base de datos
yarn prisma studio      # Abre interfaz visual de la BD
yarn prisma migrate dev # Crea nueva migración

# Pruebas
yarn test               # Ejecuta pruebas unitarias
yarn test:e2e          # Ejecuta pruebas end-to-end
yarn test:cov          # Genera reporte de cobertura

# Linting
yarn lint              # Verifica estilo de código
yarn format            # Formatea archivos
```

## 📦 Despliegue

### 🌐 Backend - Render

<div align="center">

```mermaid
graph LR
    A[GitHub Repository] -->|Auto Deploy| B[Render]
    B -->|Docker Build| C[Container]
    C -->|Public URL| D[https://api.router-xpert.com]
```

</div>

**Proceso de despliegue:**

1. **Push a GitHub:** El código se sube al repositorio
2. **Detección automática:** Render detecta el `Dockerfile`
3. **Build:** Se construye la imagen Docker
4. **Deploy:** Se despliega automáticamente
5. **Health Check:** Render verifica que la app esté funcionando

> ⚠️ **Nota importante:** Si el despliegue falla, revisa los logs en el dashboard de Render para identificar errores.

### 🗄️ Base de Datos - Railway

<div align="center">

```mermaid
graph TD
    A[MySQL Local] -->|Migración| B[Railway MySQL]
    B -->|Conexión Segura| C[Backend en Render]
    C -->|Queries| B
```

</div>

**Características:**

- ✅ Alta disponibilidad 99.9%
- ✅ Backups automáticos diarios
- ✅ Conexión SSL/TLS
- ✅ Escalamiento automático


## 🛠️ Tecnologías

<div align="center">

### Stack Principal

<table>
<tr>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="80" height="80" alt="TypeScript"/>
<br><strong>TypeScript</strong>
<br><sub>Lenguaje tipado</sub>
</td>
<td align="center" width="25%">
<img src="https://nestjs.com/img/logo-small.svg" width="80" height="80" alt="NestJS"/>
<br><strong>NestJS</strong>
<br><sub>Framework backend</sub>
</td>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/prisma/prisma-original.svg" width="80" height="80" alt="Prisma"/>
<br><strong>Prisma</strong>
<br><sub>ORM moderno</sub>
</td>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" width="80" height="80" alt="MySQL"/>
<br><strong>MySQL</strong>
<br><sub>Base de datos</sub>
</td>
</tr>
</table>

### Herramientas y Servicios

| Categoría | Tecnología | Propósito |
|-----------|------------|-----------|
| 🔐 **Autenticación** | Firebase Auth | Gestión de usuarios y sesiones |
| 📦 **ORM** | Prisma | Mapeo objeto-relacional |
| 🚀 **Deploy Backend** | Render | Hosting del servidor |
| 🗄️ **Deploy BD** | Railway | Hosting de base de datos |
| 🔄 **Versionado** | Git & GitHub | Control de versiones |
| 📝 **Linting** | ESLint | Análisis de código |
| 💅 **Formato** | Prettier | Formateo automático |
| 🧪 **Testing** | Jest | Framework de pruebas |

</div>

---

## ✒️ Autores

<div align="center">

<table>
<tr>
<td align="center">
<a href="https://github.com/juancapera26">
<img src="https://github.com/juancapera26.png" width="100px;" alt="Juan Capera"/><br>
<sub><b>Juan Capera</b></sub>
</a><br>
<sub>Full Stack Developer</sub><br>
<a href="https://github.com/juancapera">💻</a>

</td>
<td align="center">
<a href="https://github.com/master2x">
<img src="https://github.com/master2x.png" width="100px;" alt="Jair Duarte"/><br>
<sub><b>Jair Duarte</b></sub>
</a><br>
<sub>Full Stack Developer</sub><br>
<a href="https://github.com/jairduarte">💻</a>

</td>
<td align="center">
<a href="https://github.com/LEONARDOSQL-hub">
<img src="https://github.com/LEONARDOSQL-hub.png" width="100px;" alt="Jose Becerra"/><br>
<sub><b>Jose Becerra</b></sub>
</a><br>
<sub>Full Stack Developer</sub><br>
<a href="https://github.com/josebecerra">💻</a>
</td>
</tr>
</table>

</div>
</div>
