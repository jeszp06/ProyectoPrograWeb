# ProyectoPrograWeb 📊

Una Single Page Application (SPA) desarrollada con JavaScript Vanilla para la gestión integral de proyectos, control de presupuestos y asignación de recursos, operando 100% en el frontend.

## Características Principales
* **Gestión de Recursos:** Mantenimiento de personal (costo/hora), materiales (costo/unidad) y otros gastos.
* **Control de Tareas:** Definición de tiempos de ejecución y asignación dinámica de recursos.
* **Dashboard Interactivo:** Panel de control con animaciones CSS que calcula y muestra el porcentaje de avance del proyecto.
* **Métricas de Costo:** Comparativa automática entre el presupuesto estimado y el costo real (calculado únicamente sobre tareas marcadas como concluidas).
* **Alertas de Sobreutilización:** Algoritmo que detecta y alerta si un empleado supera las 8 horas de trabajo diario según las fechas de sus tareas asignadas.
* **Integridad Referencial:** Bloqueo de eliminación para recursos que ya se encuentran asignados a una actividad.

## Tecnologías Utilizadas
* HTML5
* CSS3 (Flexbox, Grid, Keyframes, Transformaciones)
* JavaScript Puro (ES6+)
* LocalStorage API (Persistencia de datos)

## Instalación y Uso
1. Clona este repositorio o descarga los archivos en formato ZIP.
2. Extrae los archivos en una carpeta local.
3. Abre el archivo `index.html` en cualquier navegador web moderno.