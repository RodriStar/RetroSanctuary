# Retro Sanctuary API

Backend desarrollado con **Node.js, Express y MongoDB** para la gestión de consolas retro y videojuegos.

La API permite registrar usuarios, autenticar mediante **JWT**, y administrar consolas y videojuegos con control de permisos.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Postman

---

## Instalación

1. Clonar el repositorio:
git clone https://github.com/RodriStar/RetroSanctuary.git


2. Entrar al directorio del proyecto:
cd RetroSanctuary

3. Instalar dependencias:
npm install


---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el formato del contenido del archvio .env.example y completarlo con datos válidos.


---

## Ejecutar el proyecto
npm start


El servidor se ejecutará en:
http://localhost:3001


---

## Autenticación

La API utiliza **JWT** para autenticar usuarios.

### Registro
POST /api/auth/registrar


### Login
POST /api/auth/login


El login devuelve un **token JWT** que debe enviarse en los endpoints protegidos.

Header:
Authorization: Bearer TOKEN


---

## Endpoints principales

### Usuarios
POST /api/auth/registrar
POST /api/auth/login


---

### Consolas
GET /api/consolas
POST /api/consolas
PUT /api/consolas/:id
PATCH /api/consolas/:id
DELETE /api/consolas/:id


- Solo **admin** puede crear, editar o eliminar consolas.
- El DELETE utiliza **soft delete**.

---

### Videojuegos
GET /api/juegos
POST /api/juegos
PUT /api/juegos/:id
DELETE /api/juegos/:id


- Cualquier usuario autenticado puede crear videojuegos.
- Un usuario solo puede modificar o eliminar los videojuegos que él creó.
- Se utilizan **relaciones con populate()** para mostrar datos de consola y usuario.

---

## Colección Postman

El repositorio incluye una colección de Postman para probar todos los endpoints:
\postman\Retro Sanctuary API.postman_collection.json


Importar el archivo en Postman para probar la API fácilmente.

---

## Autor: Rodrigo Martínez I.

Proyecto desarrollado como **Desafío Integrador Backend**.