export const APP_MESSAGES = {
  auth: {
    invalidCredentials: "Usuario o contrasena invalida.",
    databaseUnavailable:
      "No pude validar el usuario en la base de datos. Intenta de nuevo o usa el usuario temporal.",
  },
  users: {
    loadError: "No pude cargar los usuarios. Revisa la conexion con la base de datos.",
    createSuccess: "Usuario creado correctamente.",
    createError: "No pude crear el usuario. Intenta nuevamente.",
    requiredFields: "Nombre, usuario y contrasena son obligatorios.",
    duplicatedUser: "Ya existe un usuario con ese usuario o correo.",
  },
} as const;
