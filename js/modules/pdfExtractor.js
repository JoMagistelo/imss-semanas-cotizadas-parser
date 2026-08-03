// Módulo responsable únicamente de leer el PDF y extraer el texto bruto.
export async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        // Ordenamiento por coordenadas Y (Método robusto para evitar cruces en tablas)
        content.items.sort((a, b) => {
            if (Math.abs(a.transform[5] - b.transform[5]) > 2) { 
                return b.transform[5] - a.transform[5]; // Orden vertical (de arriba a abajo)
            }
            return a.transform[4] - b.transform[4]; // Orden horizontal (de izquierda a derecha)
        });

        const strings = content.items.map(item => item.str);
        fullText += strings.join('\n') + '\n';
    }
    
    return fullText;
}
