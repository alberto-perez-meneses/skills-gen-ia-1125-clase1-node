const MIN_HOUR = 0;
const MAX_HOUR = 23;
const DAYLIGHT_START = 7;
const DAYLIGHT_END = 17;

function whatPartOfDay(hour) {
    // Validar que sea un número
    if (typeof hour !== 'number') {
        return "Undetermined";
    }
    
    // Validar que sea un número entero (no decimal)
    if (!Number.isInteger(hour)) {
        return "Undetermined";
    }
    
    // Validar que esté en el rango válido
    if (hour < MIN_HOUR || hour > MAX_HOUR) {
        return "Undetermined";
    }
    
    // Determinar si es Daylight (7-17) o Night (0-6 o 18-23)
    if (hour >= DAYLIGHT_START && hour <= DAYLIGHT_END) {
        return "Daylight";
    }
    
    return "Night";
}

module.exports = {
    whatPartOfDay
};