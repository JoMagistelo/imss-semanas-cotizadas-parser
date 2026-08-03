// Módulo exclusivo para manipulación del DOM
export function renderPersonalData(data) {
    const tbody = document.querySelector('#personal-table tbody');
    tbody.innerHTML = '';
    
    for (const [key, value] of Object.entries(data)) {
        const tr = document.createElement('tr');
        const tdKey = document.createElement('td');
        const tdVal = document.createElement('td');
        
        tdKey.textContent = key;
        tdKey.style.fontWeight = '600';
        tdVal.textContent = value;
        
        tr.appendChild(tdKey);
        tr.appendChild(tdVal);
        tbody.appendChild(tr);
    }
}

export function renderHistoryData(history) {
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = '';
    
    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No se encontró historial laboral o el formato es incompatible.</td></tr>';
        return;
    }

    history.forEach(job => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${job["Nombre del patrón"]}</td>
            <td>${job["Registro Patronal"]}</td>
            <td>${job["Entidad federativa"]}</td>
            <td>${job["Fecha de alta"]}</td>
            <td>${job["Fecha de baja"]}</td>
            <td>$${job["Salario Base de Cotización"].toFixed(2)}</td>
        `;
        
        tbody.appendChild(tr);
    });
}
