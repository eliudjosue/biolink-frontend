# 🔗 BioLink Frontend (Angular 17)

Frontend moderno para una aplicación tipo Linktree, construido con Angular, Tailwind y Chart.js.  
Permite a los usuarios gestionar enlaces personalizados, acceder a estadísticas visuales y compartir su perfil público.

---

## 🚀 Funcionalidades

- 🟣 Panel de usuario con links personalizados
- 📊 Dashboard con analíticas visuales (Chart.js)
- 🖼️ Perfiles públicos accesibles vía `/username`
- ✅ Autenticación con JWT
- 📱 Diseño responsive y UI moderna

---

## 🛠️ Tecnologías

- Angular 17 + Standalone Components
- RxJS + Guards personalizados
- Chart.js
- Angular Router

---

## ▶️ Iniciar en local

```bash
git clone https://github.com/tu-usuario/biolink-frontend.git
cd biolink-frontend
npm install
ng serve
```

> ⚠️ Requiere tener corriendo previamente la API backend:  
> [Biolink API FastAPI](https://github.com/eliudjosue/biolink-api-fastapi)

---

## 📂 Estructura general

```
src/
├── app/
│   ├── core/            # Guards, servicios globales
│   ├── features/        # Módulos funcionales (login, dashboard, etc)
│   ├── models/          # Interfaces y tipos
│   ├── services/        # Servicios conectados a la API
│   ├── layouts/         # Main layout con rutas hijas
```

---

## ✍️ Autor

Desarrollado por [Eliud Campos](https://github.com/eliudjosue)  
Proyecto open source educativo y extensible 🚀

---
<!-- # BiolinkFront -->

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
