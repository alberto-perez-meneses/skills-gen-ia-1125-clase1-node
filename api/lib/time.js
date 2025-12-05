// step 1
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const DAYLIGHT_START = 7;
const DAYLIGHT_END = 17;

function isValidHour(hour) {
<<<<<<< HEAD
    const isNumber = typeof hour === 'number';
    const isInteger = Number.isInteger(hour);
    const isInRange = hour >= MIN_HOUR && hour <= MAX_HOUR;
    return isNumber && isInteger && isInRange;
=======
    
        if (typeof hour !== 'number' || 
            !Number.isInteger(hour) ||
             hour < MIN_HOUR || hour > MAX_HOUR) {
            return false;
        }
        return true;
>>>>>>> f6bbe699b659f66ab88140d4453bef7e9ec45a95
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