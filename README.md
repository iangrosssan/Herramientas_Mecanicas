# MecaToolbox (Herramientas de Mecánico)

Este repositorio es una suite modular de herramientas para ingeniería mecánica, diseñada para transformar cálculos estáticos en un dashboard interactivo.
% Maybe make it a bit more of a game, kinematic simulator
% your select an observable and apply mechanical operations to it

## 🎯 Metas del Proyecto

1. **Profesionalización de la Ingeniería**: Transicionar de scripts aislados hacia una arquitectura de "caja de herramientas" centralizada y reutilizable.
   % más que reutilizable, quiero que sea versátil, mi foco es poder seguir un proceso ingenieril. Por ejemplo, se puede:
* definir un sólido para resolver FEM

* medir propiedades en un ciclo termodinámico

* diseñar engranes según estrés de operación

* etc...
  
  según como el usuario interactúe distintos paneles de acceso
2. **Motor Rápido y Modular**: Mantener correlaciones físicas y propiedades de fluidos en una capa de backend limpia (FastAPI) accesible para cualquier frontend.
3. **Experiencia de Usuario (UX) Superior**: Dashboard intuitivo con feedback en tiempo real, reduciendo el margen de error en cálculos complejos.
   
   % Choose your fighter type deal
4. **Escalabilidad**: Diseño preparado para incorporar módulos adicionales (Termodinámica, Mecánica de Sólidos, etc.) sin rediseñar la infraestructura base.

## 🚀 Módulos Actuales

### 1. Herramientas de Transferencia de Calor (`heat_convection`)

**Estado:** *Dashboard Interactivo*

- **Propiedades de Fluidos Dinámicas**: Cálculo de densidad, viscosidad, conductividad y números adimensionales (Pr) para agua y aire.
- **RESTful API**: Lógica física expuesta mediante FastAPI.
- **Interfaz Moderna**: UI con Glassmorphism y modo oscuro.

### 2. Deflection Tool (`deflection_tool`)

**Estado:** *Validado (Solver)*

- Paquete modular para el cálculo de deflexión en vigas y ejes.
- **Entrada JSON**: Definición de geometría, materiales y cargas.
- **Validado**: Comparado contra resultados analíticos en `VALIDATED_RESULTS.md`.

### 3. Diseño de Elementos (Legacy/Hojas)

- **Frenos y Embragues**: `frenos&embragues.nb` (Mathematica Notebook).
- **Cálculo de Engranes**: `Calculo_de_Engrane.xlsx` (Excel).

## 🛠 Instalación y Uso

### Requisitos

- Python 3.9+
- Node.js 18+

### Inicio Rápido (MecaToolbox Dashboard)

```bash
cd heat_convection
chmod +x start_toolbox.sh
./start_toolbox.sh
```

Acceda a la UI en: [http://localhost:5173](http://localhost:5173)

### Uso de Deflection Tool

```bash
python3 deflection_tool/main.py deflection_tool/examples/gear_shaft.json
```

## 📁 Estructura del Proyecto

Vea el archivo [proposed_structure.md](file:///home/iangrosan/Desktop/Proyectos/git/Herramientas_de_Mecanico/proposed_structure.md) para conocer la visión de organización del repositorio.

% of course, the idea is to upload all toola onto localhost, but that'll take time, consider a section on the Implementation Plan

# Future Goals

Última Actualización
marzo 10 2026
