// Módulo de extracción de datos con validación y conciliación de métodos.
export class IMSSParser {
    static parse(text) {
        return {
            personal: this.extractPersonalData(text),
            history: this.extractWorkHistory(text)
        };
    }

    static extractPersonalData(text) {
        // Modelo 1: Datos Personales
        const data = {
            "Nombre": "",
            "NSS": "",
            "CURP": "",
            "Fecha de emisión del reporte": "",
            "Total de semanas cotizadas": 0,
            "Semanas cotizadas": 0,
            "Semanas Descontadas (por disposición de recursos) (-)": 0,
            "Semanas Reintegradas (+)": 0
        };

        // Extracción de Nombre (después de "Estimado(a),")
        const nameMatch = text.match(/Estimado\(a\),[\s\S]*?(\d{4})\s*([A-ZÑÁÉÍÓÚ\s]+?)\s*(?:NSS:|DD\s*MM\s*YYYY)/i);
        if (nameMatch && nameMatch[2]) {
            data.Nombre = nameMatch[2].replace(/\n/g, ' ').trim();
        }

        // Extracción de NSS
        const nssMatch = text.match(/NSS:\s*(\d{11})/i);
        if (nssMatch) data.NSS = nssMatch[1];

        // Extracción de CURP
        const curpMatch = text.match(/CURP:\s*([A-Z0-9]{18})/i);
        if (curpMatch) data.CURP = curpMatch[1];

        // Fecha de emisión
        const fechaMatch = text.match(/Fecha de emisión del reporte\s*[\n]*(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})/i);
        if (fechaMatch) data["Fecha de emisión del reporte"] = `${fechaMatch[1]}/${fechaMatch[2]}/${fechaMatch[3]}`;

        // Semanas (Cotizadas, Descontadas, Reintegradas)
        // Patrón típico: 264 0 0 debajo de (por disposición de recursos) (-)
        const semanasMatch = text.match(/\(-\)\s*[\n]*(\d+)\s+(\d+)\s+(\d+)/);
        if (semanasMatch) {
            data["Total de semanas cotizadas"] = parseInt(semanasMatch[1], 10);
            data["Semanas cotizadas"] = parseInt(semanasMatch[1], 10);
            data["Semanas Descontadas (por disposición de recursos) (-)"] = parseInt(semanasMatch[2], 10);
            data["Semanas Reintegradas (+)"] = parseInt(semanasMatch[3], 10);
        } else {
            // Fallback para semanas totales
            const totalMatch = text.match(/Total de semanas cotizadas[\s\S]*?(\d+)/i);
            if (totalMatch) {
                data["Total de semanas cotizadas"] = parseInt(totalMatch[1], 10);
                data["Semanas cotizadas"] = parseInt(totalMatch[1], 10);
            }
        }

        return data;
    }

    static extractWorkHistory(text) {
        const history = [];
        const startIndex = text.indexOf("Tu historia laboral"); // Usamos esto como punto de partida
        if (startIndex === -1) return history;
        
        const historyText = text.substring(startIndex);
        
        // Regex para encontrar cada bloque de historial laboral.
        // Un bloque empieza con "Nombre del patrón" y termina antes del siguiente "Nombre del patrón" o "Importante".
        const blockRegex = /Nombre del patrón[\s\S]*?(?=(?:Nombre del patrón|Importante))/gi;
        const blocks = historyText.match(blockRegex);

        if (!blocks) return history;

        for (const block of blocks) {
            // 1. Nombre del Patrón
            const patronMatch = block.match(/Nombre del patrón\s*([\s\S]*?)(?:Registro Patronal|Entidad federativa)/i);
            const nombrePatron = patronMatch ? patronMatch[1].replace(/\n/g, ' ').trim() : "";

            // 2. Registro Patronal
            const regMatch = block.match(/Registro Patronal\s*([A-Z0-9]+)/i);
            const registroPatronal = regMatch ? regMatch[1] : "";

            // 3. Fechas (Buscando explícitamente las etiquetas)
            const altaMatch = block.match(/Fecha de alta\s*(\d{2}\/\d{2}\/\d{4})/i);
            const bajaMatch = block.match(/Fecha de baja\s*(\d{2}\/\d{2}\/\d{4})/i);
            const fechaAlta = altaMatch ? altaMatch[1] : "";
            const fechaBaja = bajaMatch ? bajaMatch[1] : (altaMatch ? "Vigente" : "");

            // 4. Salario Base de Cotización
            const sbcMatch = block.match(/Salario Base de Cotización[\s\S]*?\$\s*([\d,.]+)/i);
            const sbc = sbcMatch ? parseFloat(sbcMatch[1].replace(/,/g, '')) : 0.0;

            // 5. Entidad Federativa
            const entidades = ["AGUASCALIENTES","BAJA CALIFORNIA SUR","BAJA CALIFORNIA","CAMPECHE","COAHUILA","COLIMA","CHIAPAS","CHIHUAHUA","CIUDAD DE MÉXICO","DURANGO","GUANAJUATO","GUERRERO","HIDALGO","JALISCO","MÉXICO","MICHOACÁN","MORELOS","NAYARIT","NUEVO LEÓN","OAXACA","PUEBLA","QUERÉTARO","QUINTANA ROO","SAN LUIS POTOSÍ","SINALOA","SONORA","TABASCO","TAMAULIPAS","TLAXCALA","VERACRUZ","YUCATÁN","ZACATECAS"];
            let entidad = "";
            for (const estado of entidades) {
                if (block.toUpperCase().includes(estado)) {
                    entidad = estado;
                    break;
                }
            }

            history.push({
                "Nombre del patrón": nombrePatron,
                "Registro Patronal": registroPatronal,
                "Entidad federativa": entidad,
                "Fecha de alta": fechaAlta,
                "Fecha de baja": fechaBaja,
                "Salario Base de Cotización": sbc
            });
        }
        
        return history;
    }
}
