
# Backlog – Sistema Administrador de Notas

## Tecnologías
- Backend: Express.js (API REST)
- Frontend: Microfrontend React
- Testing: TDD (Jest, Supertest, React Testing Library)

---

# Backend – API Express.js

## NOTES-BE-1: Crear nota

### Historia de usuario
Como sistema, quiero exponer un endpoint para crear notas y persistirlas correctamente.

### Endpoint
POST /api/notes

### Request Body
```json
{
  "title": "string",
  "content": "string"
}
````

### Criterios de aceptación

1. Cuando `title` es válido, responde `201 Created` con la nota creada.
2. Si `title` es vacío o inexistente, responde `400 Bad Request`.
3. La nota se persiste usando una capa de repositorio desacoplada.
4. La respuesta incluye `id` y `createdAt`.

### Definition of Done

* Tests unitarios y de integración pasan.
* Validaciones cubiertas con TDD.
* Código cumple principios SOLID.
* Endpoint documentado implícitamente por tests.
* No hay warnings ni errores de lint.

---

## NOTES-BE-2: Listar notas

### Historia de usuario

Como sistema, quiero exponer un endpoint para obtener todas las notas.

### Endpoint

GET /api/notes

### Criterios de aceptación

1. Responde `200 OK`.
2. Retorna un arreglo de notas.
3. Si no existen notas, retorna `[]`.

### Definition of Done

* Tests validan lista vacía y lista con datos.
* Respuesta tipada y consistente.
* No dependencia directa de infraestructura.

---

## NOTES-BE-3: Editar nota

### Historia de usuario

Como sistema, quiero actualizar una nota existente.

### Endpoint

PUT /api/notes/:id

### Criterios de aceptación

1. Si el `id` existe, responde `200 OK`.
2. Si el `id` no existe, responde `404 Not Found`.
3. Si `title` es inválido, responde `400 Bad Request`.

### Definition of Done

* Tests cubren casos normales y de error.
* No se crean notas nuevas accidentalmente.
* Repositorio correctamente mockeado.

---

## NOTES-BE-4: Eliminar nota

### Historia de usuario

Como sistema, quiero eliminar una nota existente.

### Endpoint

DELETE /api/notes/:id

### Criterios de aceptación

1. Si el `id` existe, responde `204 No Content`.
2. Si el `id` no existe, responde `404 Not Found`.

### Definition of Done

* Tests validan eliminación.
* Estado consistente tras la operación.
* Sin efectos secundarios.

---

# Frontend – Microfrontend React

## NOTES-FE-1: Crear nota

### Historia de usuario

Como usuario, quiero crear una nota desde la interfaz.

### Criterios de aceptación

1. Formulario con título y contenido.
2. Llama a `POST /api/notes`.
3. Limpia el formulario al éxito.
4. Muestra errores de la API.

### Definition of Done

* Tests con React Testing Library.
* Llamadas HTTP mockeadas.
* Componente desacoplado del backend.
* Cumple principios de accesibilidad básicos.

---

## NOTES-FE-2: Listar notas

### Historia de usuario

Como usuario, quiero ver un listado de mis notas.

### Criterios de aceptación

1. Llama a `GET /api/notes` al montar.
2. Renderiza lista con título y fecha.
3. Muestra mensaje si no hay notas.

### Definition of Done

* Renderizado condicional testeado.
* Uso correcto de keys.
* Manejo de estados loading y empty.

---

## NOTES-FE-3: Editar nota

### Historia de usuario

Como usuario, quiero editar una nota existente.

### Criterios de aceptación

1. Formulario precargado.
2. Llama a `PUT /api/notes/:id`.
3. Actualiza el estado global.

### Definition of Done

* Tests validan precarga y submit.
* Estado sincronizado tras edición.
* Sin mutaciones directas de estado.

---

## NOTES-FE-4: Eliminar nota

### Historia de usuario

Como usuario, quiero eliminar una nota.

### Criterios de aceptación

1. Botón de eliminar visible.
2. Modal de confirmación.
3. Llama a `DELETE /api/notes/:id`.
4. La nota desaparece del UI.

### Definition of Done

* Modal testeado.
* Estado actualizado correctamente.
* UI consistente tras eliminación.

