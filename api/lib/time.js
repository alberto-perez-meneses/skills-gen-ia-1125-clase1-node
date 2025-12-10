// step 1
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const DAYLIGHT_START = 7;
const DAYLIGHT_END = 17;

function isValidHour(hour) {
    
        if (typeof hour !== 'number' || 
            !Number.isInteger(hour) ||
             hour < MIN_HOUR || hour > MAX_HOUR) {
            return false;
        }
        return true;
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