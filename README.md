# Trabajo Práctico Integrador de Programación Web II

## Descripción
Este proyecto es una aplicación web full-stack que se inspira en el viejo Instagram. El desarrollo puso en práctica la arquitectura de software del lado del servidor, el diseño de bases de datos relacionales, el rendimiento de consultas masivas y el renderizado dinámico en tiempo real.

La aplicación permite a los usuarios registrados crear sus propias publicaciones, comentarios, valorizar imágenes de otras publicaciones y seguir a otros usuarios.

La aplicación utiliza un motor de plantillas para la estructura del cliente, gestiona la lógica de negocio y las APIs asíncronas con Node.js, y persiste los datos en PostgreSQL a través de Sequelize.

---

## Instalación y Configuración Local

### 1. Clonar el repositorio
- `git clone https://github.com`
- `cd tpi_web2`

### 2. Instalar dependencias
- `npm install`

### 3. Configurar variables de entorno
Creá un archivo llamado `.env` en la raíz del proyecto y completalo con:

- PORT=3000
- NODE_ENV=development
- DB_USER=postgres
- DB_PASSWORD=admin123
- DB_NAME=tpi_web2
- DB_HOST=localhost
- DB_PORT=5432
- SESSION_SECRET=mi-clave-secreta-de-usuario

### 4. Comandos maestros
- Inicializar y poblar la Base de Datos: `npm run setup:db`.
- Modo de producción: `npm start`.
- Modo de desarrollo: `npm run dev`.

Luego ingresá a: `http://localhost:3000`.

---

## Cuentas de usuario para pruebas

La base de datos cuenta con 200 usuarios, permitiendo simular una red social real.

Ejemplo para el ingreso:

| Parámetro | Credenciales de Ejemplo |
| :--- | :--- |
| **Nombre** | `Manuel` |
| **Email** | `correodemanuel@gmail.com` |
| **Contraseña** | `manuel123` |

El correo de todos los usuarios es `correode<nombre>@gmail.com` y la contraseña `<nombre>123`.

---

## Funcionalidades implementadas
<details>
<summary>👥 1. Gestión de Usuarios</summary>

*   **Autenticación Segura:** Sistema de Registro (Signup), Ingreso (Login) y Cierre de sesión (Logout).
*   **Perfil Personalizable:** Los usuarios pueden cargar una fotografía de perfil, editar su descripción, nombre, email y contraseña.
*   **Seguimiento (Follow/Unfollow):** Sistema de seguidores y seguidos.
</details>

<details>
<summary>📸 2. Publicaciones y Soporte Multimedia</summary>

*   **Imágenes:** Soporte para hasta 5 imágenes por cada publicación.
*   **Licencias:** Atributo de imagen libre o con derechos de autor. Enlaces de restricción y censura visual para los usuarios no registrados.
*   **Marcas de Agua:** Inyección de texto de propiedad en tiempo real a través de CSS, protegiendo las imágenes sin duplicar archivos en el almacenamiento.
</details>

<details>
<summary>💬 3. Interacciones y Chats</summary>

*   **Comentarios Independientes:** Cada imagen dentro de una misma publicación posee su propio panel de comentarios.
*   **Moderación del Dueño:** El creador de la publicación puede habilitar o deshabilitar los comentarios de cualquier imagen.
*   **Chat en Vivo Privado:** Bandeja de mensajes privados..
</details>

<details>
<summary>⚡ 4. Optimización y Rendimiento</summary>

*   **Scroll Infinito:** Paginación asíncrona con un feed aleatorio y sin repeticiones.
*   **Búsqueda Avanzada Combinada:** Motor que permite cruzar filtros de nombres, títulos, etiquetas, orden cronológico y niveles de popularidad.
*   **Operaciones Asíncronas:** Eliminación, edición e inserción mediante peticiones `POST`, `PUT` y `DELETE`.
</details>

<details>
<summary>🛡️ 5. Control Denuncias</summary>

*   **Algoritmo Anti-Abuso:** Si una imagen acumula 3 o más denuncias de usuarios únicos diferentes, la publicación queda inmodificable y se envía al `Validador`.
*   **Inactivación de Cuentas:** Si el perfil acumula 3 publicaciones dadas de baja, el estado de la cuenta cambia a inactivo.
</details>

---

## Tecnologías

### Lenguajes
*   **JavaScript**: lógica del servidor y manipulación en el cliente utilizando DOM.
*   **HTML / CSS**: estructuración de la página y manipulación de estilos.

### Backend y Middleware
*   **Node.js y Express**: gestión de ejecución y enrutamiento del servidor web.
*   **Express-Session y Cookie-Parser**: gestión de estados de sesión y persistencia de autenticación.
*   **Multer**: middleware para el procesamiento de imágenes.

### Persistencia y ORM
*   **Sequelize**: modelado de datos relacionales y validaciones.
*   **PostgreSQL**: motor de base de datos relacional.

### Frontend
*   **Pug**: renderizado del lado del servidor.

## Observaciones y Limitaciones del Desarrollo

*   **Cuello de Botella:** la consulta sufría ralentizaciones de hasta 13 segundos tras haber aumentado la cantidad de usuarios a 267. Se solucionó separando la selección: primero obtener IDs aleatorios de las publicaciones y luego obtener los demás datos necesarios, reduciendo la latencia a menos de 400 ms.
*   **Peticiones Simultáneas Masivas:** el uso de `Promise.all` en el archivo `popular.js` provocaba la saturación del grupo de conexiones a la base de datos y violaciones de llaves foráneas al intentar insertar tantos datos simultáneamente. Se solucionó implementando una carga secuencial.
*   **Formularios Nativos HTML:** se implementó interceptores de eventos JavaScript para el uso de los métodos `PUT` y `DELETE` debido a la limitación de los navegadores que solo aceptan `GET` y `POST`.