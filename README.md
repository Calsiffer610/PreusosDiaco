# Miller Frontend

Prototipo en Next.js para digitalizar formularios operativos de pre-uso.

El objetivo inicial es reemplazar formatos en Excel por una aplicacion web donde la compania pueda crear usuarios, iniciar sesion, abrir formularios, diligenciar inspecciones y consultar registros guardados.

## Estado Actual

El proyecto ya tiene:

- Frontend en `Next.js`.
- Login contra usuarios guardados en PostgreSQL.
- Creacion y listado de usuarios desde la pantalla `Usuarios`.
- Contrasenas guardadas como hash, no como texto plano.
- ORM `Prisma` configurado con PostgreSQL.
- Visualizador de base de datos con `Prisma Studio`.
- Formulario inicial `PRE USOS TREN`.
- Guardado temporal de formularios en `localStorage`.

Importante: los usuarios ya van a base de datos. Las respuestas del formulario todavia no se estan guardando en PostgreSQL; por ahora viven temporalmente en el navegador.

## Tecnologias

- `Next.js`: framework principal de la aplicacion.
- `React`: construccion de interfaces.
- `TypeScript`: tipado del codigo.
- `Prisma`: ORM para hablar con la base de datos.
- `PostgreSQL`: base de datos.
- `Supabase`: proveedor actual de PostgreSQL.
- `Vercel`: plataforma objetivo para despliegue.

## Estructura del Proyecto

```text
.
├── prisma/
│   └── schema.prisma          # Modelos de base de datos
├── public/
│   └── miller-architecture-explained.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/login/    # Endpoint de login
│   │   │   └── users/         # Endpoint de usuarios
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Pantallas principales
│   ├── constants/
│   │   └── messages.ts        # Mensajes en espanol
│   ├── data/
│   │   └── forms.ts           # Formulario PRE USOS TREN
│   ├── generated/prisma/      # Cliente Prisma generado
│   └── lib/
│       ├── password.ts        # Hash/verificacion de contrasenas
│       └── prisma.ts          # Cliente Prisma compartido
├── .env.example
├── package.json
├── prisma.config.ts
└── README.md
```

## Modelos de Base de Datos

El esquema vive en `prisma/schema.prisma`.

Actualmente tiene tres modelos simples:

- `User`: usuarios del sistema.
- `FormTemplate`: definicion general de formularios disponibles.
- `FormSubmission`: respuestas guardadas de formularios, usando un campo `Json`.

Por ahora solo `User` se usa activamente desde la interfaz. `FormSubmission` esta preparado para el siguiente paso: guardar respuestas del formulario en PostgreSQL.

## Descargar el Proyecto

Clona el repositorio:

```bash
git clone https://github.com/Calsiffer610/PreusosDiaco.git
```

Entra a la carpeta:

```bash
cd PreusosDiaco
```

Instala dependencias:

```bash
npm install
```

El script `postinstall` ejecuta automaticamente:

```bash
prisma generate
```

Eso genera el cliente Prisma dentro de `src/generated/prisma`.

## Configurar Variables de Entorno

Crea el archivo `.env` a partir de `.env.example`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En bash:

```bash
cp .env.example .env
```

Luego edita `.env` y coloca tu conexion real:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Nunca subas `.env` a Git. Ese archivo puede contener credenciales reales.

## Preparar la Base de Datos

Genera el cliente Prisma:

```bash
npm run db:generate
```

Sincroniza el esquema con la base:

```bash
npm run db:push
```

Si estas en una base de desarrollo y quieres borrar todo para recrear el esquema:

```bash
npx prisma db push --force-reset
```

Usa `--force-reset` con cuidado: borra los datos de la base. No debe usarse en produccion.

## Abrir Prisma Studio

Prisma Studio permite ver y editar tablas desde el navegador.

```bash
npm run db:studio
```

Normalmente abre en:

```text
http://localhost:5555
```

Desde ahi puedes ver la tabla `User` y crear el primer usuario si todavia no puedes entrar a la app.

## Correr en Local

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre:

```text
http://localhost:3000
```

Para compilar como produccion:

```bash
npm run build
```

Para correr la version compilada:

```bash
npm run start
```

Para validar TypeScript:

```bash
npm run lint
```

## Acceso a la Aplicacion

El login usa unicamente usuarios guardados en PostgreSQL.

Ya no existe acceso quemado tipo `generic/generic`.

Para entrar:

1. Crea un usuario desde `Prisma Studio` en la tabla `User`, o desde el modulo `Usuarios` si ya tienes una sesion activa.
2. Usa el `username` y la contrasena creada.
3. El sistema valida la contrasena usando hash con `scrypt`.

## Flujo Actual de la App

1. El usuario entra al login.
2. La app llama a `/api/auth/login`.
3. El backend busca el usuario en PostgreSQL con Prisma.
4. Se verifica la contrasena contra `passwordHash`.
5. Si el login es correcto, el usuario entra al home.
6. Desde el home puede ir a `Formularios` o `Usuarios`.
7. En `Usuarios`, puede crear nuevos usuarios en PostgreSQL.
8. En `Formularios`, puede diligenciar el formulario `PRE USOS TREN`.
9. Las respuestas del formulario se guardan temporalmente en `localStorage`.

## Endpoints Principales

Login:

```text
POST /api/auth/login
```

Usuarios:

```text
GET /api/users
POST /api/users
```

## Mensajes en Espanol

Los mensajes de error y exito estan centralizados en:

```text
src/constants/messages.ts
```

Si quieres cambiar el texto que ve el usuario, hazlo ahi.

Ejemplo:

```ts
createSuccess: "Usuario creado correctamente.",
createError: "No pude crear el usuario. Intenta nuevamente.",
duplicatedUser: "Ya existe un usuario con ese usuario o correo.",
```

## Flujo de Trabajo con Git

Ver el estado del repo:

```bash
git status
```

Ver cambios en archivos:

```bash
git diff
```

Agregar cambios:

```bash
git add .
```

Crear commit:

```bash
git commit -m "Describe el cambio realizado"
```

Subir cambios a GitHub:

```bash
git push
```

Si es la primera vez que subes una rama:

```bash
git push -u origin main
```

## Buenas Practicas con Git

- Antes de empezar, ejecuta `git pull` para traer cambios remotos.
- Antes de hacer commit, revisa `git status`.
- No subas `.env`.
- Haz commits pequenos y con mensajes claros.
- No mezcles cambios no relacionados en el mismo commit.

## Scripts Disponibles

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "postinstall": "prisma generate",
  "lint": "tsc --noEmit",
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:push": "prisma db push",
  "db:studio": "prisma studio"
}
```

## Propuesta de Evolucion

La compania parece tener una operacion industrial donde los pre-usos son controles diarios de seguridad, disponibilidad y cumplimiento. La mejora principal es convertir cada Excel mensual en un flujo operacional vivo:

- Guardar respuestas de formularios en PostgreSQL.
- Capturar evidencia fotografica en hallazgos criticos.
- Crear acciones correctivas con responsable, fecha compromiso, estado y cierre.
- Construir tableros por area, equipo e item.
- Exportar PDF/Excel para auditorias.
- Agregar roles reales: operador, supervisor, mantenimiento, HSE y administrador.
- Integrar login corporativo con Microsoft Entra ID / Outlook.
- Desplegar en Vercel con variables de entorno seguras.

## Siguiente Paso Tecnico

El siguiente paso recomendado es conectar el boton de guardar formulario con la tabla `FormSubmission`.

Hoy el formulario se guarda en `localStorage`. La siguiente version deberia guardar en PostgreSQL usando Prisma, para que los registros esten disponibles desde cualquier equipo y no solo desde el navegador local.
