import { extractTextFromPDF } from './modules/pdfExtractor.js';
import { IMSSParser } from './modules/dataParser.js';
import { renderPersonalData, renderHistoryData } from './modules/uiManager.js';
import { exportToExcel } from './modules/excelExporter.js';

// Configuración de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

let currentData = null;
let currentRawText = '';

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('results-section');
    const btnExport = document.getElementById('btn-export');
    const btnDownloadTxt = document.getElementById('btn-download-txt');

    // Manejo de Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-active');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-active'));

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-active');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Manejo de Input tradicional
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // Exportación
    btnExport.addEventListener('click', () => {
        if (currentData) {
            exportToExcel(currentData.personal, currentData.history);
        }
    });

    // Descarga de texto plano
    btnDownloadTxt.addEventListener('click', () => {
        if (currentRawText) {
            const blob = new Blob([currentRawText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'texto_extraido_pdf.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    async function handleFile(file) {
        if (file.type !== 'application/pdf') {
            alert('Por favor, selecciona un archivo PDF válido.');
            return;
        }

        loading.classList.remove('hidden');
        resultsSection.classList.add('hidden');

        try {
            // 1. Extraer texto plano y guardarlo
            const textContent = await extractTextFromPDF(file);            
            currentRawText = textContent;
            
            // 2. Parsear modelos (Conciliación de métodos dentro del parser)
            currentData = IMSSParser.parse(textContent);

            // 3. Renderizar UI
            renderPersonalData(currentData.personal);
            renderHistoryData(currentData.history);
            
            loading.classList.add('hidden');
            resultsSection.classList.remove('hidden');
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al procesar el PDF. Asegúrate de que sea una constancia oficial del IMSS.');
            loading.classList.add('hidden');
        }
    }
});
