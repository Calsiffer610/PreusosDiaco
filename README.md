# Miller Frontend

Prototipo Next.js para digitalizar formularios operativos de la compania.

## Acceso

- Usuario: `generic`
- Contrasena: `generic`

## Flujo implementado

1. Login con credenciales quemadas en `src/constants/auth.ts`.
2. Pantalla de inicio generica con acceso principal a `FORMULARIOS`.
3. Catalogo de formularios con el primer formato `PRE USOS TREN`.
4. Formulario digital de inspeccion de pre-uso con operador, turno, fecha, respuestas, hallazgos y observaciones.
5. Guardado temporal en `localStorage` del navegador.
6. Lista de formularios guardados disponibles para visualizar registros anteriores.

## Almacenamiento temporal

Por ahora los formularios guardados no van a una base de datos. Se almacenan localmente en el navegador con la clave `miller.savedInspections`.

Esto permite avanzar lento y suave: capturar, guardar y visualizar registros sin definir todavia backend, autenticacion real ni modelo de datos definitivo.

## Base de datos con Prisma

El proyecto ya tiene Prisma configurado para PostgreSQL.

1. Copia `.env.example` a `.env`.
2. Reemplaza `DATABASE_URL` con tus credenciales reales de PostgreSQL.
3. Genera el cliente:

```bash
npm run db:generate
```

4. Crea o sincroniza tablas durante desarrollo:

```bash
npm run db:migrate
```

Si solo quieres empujar el esquema sin crear migraciones:

```bash
npm run db:push
```

5. Abre el visualizador de Prisma:

```bash
npm run db:studio
```

El esquema vive en `prisma/schema.prisma` y la configuracion de Prisma 7 vive en `prisma.config.ts`.

## Propuesta de evolucion

La compania parece tener una operacion industrial donde los pre-usos son controles diarios de seguridad, disponibilidad y cumplimiento. La mejora principal es convertir cada Excel mensual en un flujo operacional vivo:

- Captura por equipo, turno y operador desde tablet o celular.
- Evidencia fotografica en hallazgos criticos.
- Acciones correctivas con responsable, fecha compromiso, estado y cierre.
- Tableros por area para ver equipos con mas reincidencias, puntos criticos y tiempos de cierre.
- Exportacion PDF/Excel para auditorias y trazabilidad.
- Roles por operador, supervisor, mantenimiento y HSE.
- Notificaciones cuando un hallazgo critico impida operar un equipo.

## Siguiente fase sugerida

1. Persistir inspecciones en base de datos.
2. Separar autenticacion real por roles.
3. Importar automaticamente nuevos formatos Excel para convertirlos en formularios.
4. Crear modulo de acciones correctivas y tablero gerencial.
