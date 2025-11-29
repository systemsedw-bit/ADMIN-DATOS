# Admin Datos

Aplicación React con TailwindCSS que implementa autenticación de correo y contraseña usando Firebase Auth, incluyendo control de roles para Administrador y Técnico.

## Requisitos previos

1. Node.js 18 o superior.
2. Una cuenta de Firebase con un proyecto configurado.

## Configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia el archivo `src/modules/firebase/firebaseConfig.sample.js` y renómbralo como `firebaseConfig.js`. Completa los valores con la configuración de tu proyecto de Firebase.

3. Ejecuta el entorno de desarrollo:

   ```bash
   npm run dev
   ```

4. Accede a `http://localhost:5173` para ver la aplicación.

## Roles de usuario

- Al registrarse, selecciona el rol (Administrador o Técnico). Se crea o actualiza un documento en la colección `userRoles` de Firestore con el rol seleccionado.
- El sistema redirige automáticamente al panel correspondiente después de iniciar sesión.

## Scripts disponibles

- `npm run dev`: levanta el servidor de desarrollo con Vite.
- `npm run build`: genera la build de producción.
- `npm run preview`: vista previa de la build.
- `npm run lint`: ejecuta ESLint (requiere configurar reglas según tus preferencias).
