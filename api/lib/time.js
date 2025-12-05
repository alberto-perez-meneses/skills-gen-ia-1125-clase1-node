// step 1
const MIN_HOUR = 0;
const MAX_HOUR = 24;
const DAYLIGHT_START = 7;
const DAYLIGHT_END = 17;

function isValidHour(hour) {
    const isNumber = typeof hour === 'number';
    const isInteger = Number.isInteger(hour);
    const isInRange = hour >= MIN_HOUR && hour <= MAX_HOUR;
    return isNumber && isInteger && isInRange;
}    

function whatPartOfDay(hour) {
    if (!isValidHour(hour)) {
        return "Undetermined";
    }
    // Determinar si es Daylight (7-17) o Night (0-6 o 18-23)
    if (hour >= DAYLIGHT_START && hour <= DAYLIGHT_END) {
        return "Daylight";
    }
    
    return "Night";
}

module.exports = {
    whatPartOfDay,
    isValidHour
};