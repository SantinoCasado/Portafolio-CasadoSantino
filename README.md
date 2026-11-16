<div align="center">

# 🖥️ Portfolio OS — Windows XP Edition

**Portfolio web interactivo desarrollado en Angular con estética fiel a Windows XP, soporte bilingüe (ES/EN) y aplicaciones funcionales integradas.**

[![Live Webpage](https://img.shields.io/badge/🌐_LIVE_WEBPAGE-Ver_Portfolio_en_Vivo-0055E5?style=for-the-badge&logo=vercel&logoColor=white)](https://portafolio-casado-santino.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-SantinoCasado-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SantinoCasado/portafolio-casado-santino)

![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 📖 Acerca del Proyecto

**Portfolio OS** reimagina el clásico portfolio de desarrollador transformándolo en un entorno de escritorio **Windows XP** completamente navegable desde el navegador. El objetivo es ofrecer una experiencia memorable e interactiva donde reclutadores y visitantes puedan explorar mis proyectos, formación y habilidades técnicas utilizando ventanas arrastrables, un buscador estilo Google retro y videojuegos clásicos recreados desde cero.

---

## ✨ Funcionalidades Principales

* **🔐 Pantalla de Inicio de Sesión (Login Screen XP):** Selección dinámica de usuario y cambio de idioma antes de ingresar al escritorio, con persistencia de sesión mediante `sessionStorage`.
* **🖥️ Escritorio Interactivo (`DeskScreen`):** Íconos ordenados en grilla, apertura múltiple de ventanas simultáneas, gestión de foco (`z-index`), maximizado a pantalla completa, minimizado y cierre.
* **🪟 Ventanas Arrastrables:** Movimiento fluido delimitado dentro del área del escritorio utilizando **Angular CDK (`CdkDrag` / `CdkDragHandle`)**.
* **📊 Barra de Tareas (`TaskBar`) y Menú Inicio:**
  * Reloj del sistema en tiempo real.
  * Acceso rápido a ventanas abiertas/minimizadas.
  * Selector de idioma en caliente (**Español / Inglés**) sin recargar la página.
  * Menú Inicio estilo XP con accesos directos a aplicaciones y cierre de sesión.
* **🌐 Soporte Bilingüe Integral (`LanguageService`):** Toda la interfaz, descripciones de proyectos, controles y estados de juego reaccionan dinámicamente al idioma seleccionado mediante **Angular Signals**.

---

## 🗂️ Aplicaciones Integradas

El sistema cuenta con un ecosistema de mini-aplicaciones propias dentro del escritorio:

### 1. 🔍 Google Projects (Buscador de Proyectos)
Simulación del buscador clásico de Google conectada a un repositorio estructurado de proyectos (`projects.json`):
* **Predictor de búsqueda en tiempo real:** Autocompletado inteligente basado en palabras clave extraídas dinámicamente de tecnologías y categorías (`Web Page`, `Desktop App`, `Data Analysis`, `Data Visualization`, `Database Management`, `Online Course`, etc.).
* **Filtrado multi-término:** Búsqueda simultánea por título, descripción bilingüe, tipo de proyecto y stack tecnológico.
* **Vista Home y Resultados:** Transición entre la pantalla principal del buscador y el listado de resultados con enlaces directos a repositorios y demos.

### 2. 📄 Visor de Currículum / Perfil Profesional
* Presentación estructurada de perfil técnico, formación académica (Tecnicatura Universitaria en Programación - UTN FRA) y stack de desarrollo y análisis de datos.
* Opción de visualización y descarga directa del CV.

### 3. 💣 Buscaminas (Minesweeper XP)
Recreación completa del clásico de Windows:
* **Selector de dificultad:** Principiante, Intermedio y Experto.
* **Mecánicas clásicas:** Primer clic seguro, revelado recursivo de celdas vacías, marcado con banderas (clic derecho), contador digital de minas restantes, temporizador y estados visuales de victoria/derrota.

### 4. 🧱 Tetris XP
Implementación completa del juego con estética de ventana clásica:
* **Grilla principal (20x10) + Vista previa (`SIGUIENTE`):** Visualización de la próxima pieza y **pieza fantasma (*ghost piece*)** que proyecta el punto exacto de aterrizaje.
* **Sistema de niveles y puntuación:** Incremento progresivo de velocidad cada 10 líneas completadas y bonificaciones por caída rápida (*soft/hard drop*).
* **Controles completos de teclado:** Movimiento lateral (`←` `→`), rotación con ajuste de pared (`↑`), caída suave (`↓`), caída instantánea (`Espacio`) y pausa (`P`).

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** Angular (Standalone Components, arquitectura compatible con Zoneless / Change Detection optimizada).
* **Lenguaje:** TypeScript, HTML5, CSS3 (estilos retro inspirados en Luna Theme / `7.css`).
* **Interactividad & UI:** `@angular/cdk` (`DragDropModule`), `FormsModule`, Angular Signals (`signal`, `computed`).
* **Gestión de Datos:** Arquitectura desacoplada basada en JSON local tipado (`ProjectInterface`) con soporte para estructuras simples y bilingües.
* **Despliegue & CI/CD:** Git, GitHub y **Vercel** (con enrutamiento SPA configurado).

---

## 🚀 Etapas de Desarrollo

1. **Etapa 1 — Arquitectura Base y Sistema de Ventanas:**
   Configuración del proyecto Angular con componentes *standalone*, diseño del layout de escritorio, barra de tareas y mecánicas de drag-and-drop con Angular CDK.
2. **Etapa 2 — Internacionalización y Pantalla de Login:**
   Implementación de `LanguageService` con Signals para soporte ES/EN en toda la aplicación y flujo de inicio de sesión con `sessionStorage`.
3. **Etapa 3 — Buscador Google Projects:**
   Modelado del esquema de proyectos (`projects.json`), construcción del motor de filtrado multi-criterio y desarrollo del predictor de sugerencias por tecnologías y tipos.
4. **Etapa 4 — Desarrollo de Minijuegos (Buscaminas y Tetris):**
   Implementación de la lógica matricial de ambos juegos, sincronización de renderizado en tiempo real (`ChangeDetectorRef`), contadores digitales y soporte de teclado.
5. **Etapa 5 — Optimización y Despliegue en Producción:**
   Ajustes de responsividad en ventanas maximizadas, limpieza de configuración de build (`dist/portafolio-os/browser`) y despliegue continuo en Vercel.

---

## 💻 Instalación y Ejecución Local

Si querés correr el proyecto en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone [https://github.com/SantinoCasado/portafolio-casado-santino.git](https://github.com/SantinoCasado/portafolio-casado-santino.git)

# 2. Entrar al directorio del proyecto
cd portafolio-casado-santino

# 3. Instalar dependencias
npm install

# 4. Levantar el servidor de desarrollo
ng serve
