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

        return newSlots;
    }
}
