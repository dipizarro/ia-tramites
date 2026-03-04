export type Slots = Record<string, any>;

export class SlotExtractor {
    extractSlots(message: string, currentSlots: Slots): Slots {
        const msg = message.toLowerCase();
        const newSlots = { ...currentSlots };

        // Aseguramos que evitamos sobrescribir a menos que el usuario use un índice
        const isNumericResponse = ['1', '2', '3', '4'].includes(msg.trim());

        if (msg.includes('instagram') && !newSlots.sales_channel) {
            newSlots.sales_channel = 'instagram';
        }

        if (isNumericResponse) {
            const m = msg.trim();
            if (m === '1') newSlots.activity_type = 'physical_goods';
            if (m === '2') newSlots.activity_type = 'digital_services';
            if (m === '3') newSlots.activity_type = 'food';
            if (m === '4') newSlots.activity_type = 'mixed';
        } else if (!newSlots.activity_type) {
            if (msg.includes('ropa') || msg.includes('producto') || msg.includes('productos')) {
                newSlots.activity_type = 'physical_goods';
            } else if (msg.includes('servicio') || msg.includes('freelance') || msg.includes('programación') || msg.includes('diseño')) {
                newSlots.activity_type = 'digital_services';
            } else if (msg.includes('comida') || msg.includes('pasteles') || msg.includes('empanada') || msg.includes('empanadas')) {
                newSlots.activity_type = 'food';
            }
        }

        // Commune extraction
        const communeMatch = msg.match(/(?:en|soy de)\s+([a-záéíóúñ\s]+)/i);
        if (communeMatch && !newSlots.commune) {
            newSlots.commune = communeMatch[1].trim();
        }

        // RUT extraction
        if (msg.includes('si tengo rut') || msg.includes('sí tengo rut') || msg.includes('tengo rut')) {
            if (!msg.includes('no tengo rut')) {
                newSlots.has_rut = true;
            }
        }
        if (msg.includes('no tengo rut')) {
            newSlots.has_rut = false;
        }

        // SII Password extraction
        if (msg.includes('tengo clave sii') || msg.includes('clave tributaria')) {
            if (!msg.includes('no tengo clave')) {
                newSlots.has_sii_password = true;
            }
        }
        if (msg.includes('no tengo clave') || msg.includes('no tengo clave sii')) {
            newSlots.has_sii_password = false;
        }

        // Start Date extraction
        if (!newSlots.start_date) {
            const isoMatch = msg.match(/\b(\d{4}-\d{2}-\d{2})\b/);
            if (isoMatch) {
                newSlots.start_date = isoMatch[1];
            } else {
                const daysMatch = msg.match(/hace (\d+) d[ií]as?/);
                if (daysMatch) {
                    const days = parseInt(daysMatch[1], 10);
                    const d = new Date();
                    d.setDate(d.getDate() - days);
                    newSlots.start_date = d.toISOString().split('T')[0];
                } else {
                    const monthsMatch = msg.match(/hace (\d+) meses?/);
                    if (monthsMatch) {
                        const months = parseInt(monthsMatch[1], 10);
                        const d = new Date();
                        d.setDate(d.getDate() - (months * 30));
                        newSlots.start_date = d.toISOString().split('T')[0];
                    }
                }
            }
        }

        return newSlots;
    }
}
