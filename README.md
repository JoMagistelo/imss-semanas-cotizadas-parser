# Extractor de Constancias de Semanas Cotizadas IMSS 🇲🇽
### Versión 0.0 — Edición Especial para Servidores Públicos

Herramienta web optimizada para la extracción, estructuración y conciliación de datos personales e historial laboral a partir de Constancias de Semanas Cotizadas del IMSS en formato PDF. Desarrollada completamente en el cliente mediante **PDF.js** y un motor de procesamiento geométrico por coordenadas que evita el desorden en tablas institucionales.

---

## 🛠️ Estructura del Proyecto

```text
imss_extractor/
├── index.html                  # Interfaz principal (UI institucional)
├── css/
│   └── styles.css              # Estilos responsivos basados en lineamientos oficiales
├── js/
│   ├── app.js                  # Lógica de orquestación y gestión de eventos
│   └── modules/
│       ├── pdfExtractor.js     # Motor de lectura y ordenamiento geométrico (ejes X/Y)
│       ├── dataParser.js       # Expresiones regulares y reglas de extracción
│       ├── uiManager.js        # Renderizado dinámico de tablas y componentes
│       └── excelExporter.js    # Exportación limpia a formato XLSX
└── README.md                   # Documentación técnica