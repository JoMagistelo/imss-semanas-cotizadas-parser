// Módulo encargado de la generación del archivo XLSX utilizando SheetJS
export function exportToExcel(personalData, historyData) {
    // Crear nuevo libro de trabajo
    const wb = XLSX.utils.book_new();

    // Hoja 1: Datos Personales
    // Convertir objeto simple a arreglo de un elemento para la hoja
    const wsPersonal = XLSX.utils.json_to_sheet([personalData]);
    
    // Hoja 2: Historial Laboral
    const wsHistory = XLSX.utils.json_to_sheet(historyData);

    // Dar formato a los anchos de columna para mejor visualización
    const wscolsPersonal = [
        {wch: 40}, {wch: 20}, {wch: 25}, {wch: 15}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}
    ];
    wsPersonal['!cols'] = wscolsPersonal;

    const wscolsHistory = [
        {wch: 40}, {wch: 20}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 15}
    ];
    wsHistory['!cols'] = wscolsHistory;

    // Agregar hojas al libro
    XLSX.utils.book_append_sheet(wb, wsPersonal, "Datos Personales");
    XLSX.utils.book_append_sheet(wb, wsHistory, "Historial Laboral");

    // Descargar archivo
    XLSX.writeFile(wb, "Reporte_Conciliado_Semanas_Cotizadas.xlsx");
}
