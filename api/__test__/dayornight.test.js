const { whatPartOfDay } = require('../lib/time');

describe("When is it daylight?", () => {
    test("hour 7 → Daylight", () => {
        expect(whatPartOfDay(7)).toBe("Daylight");
    });

    test("hour 12 → Daylight", () => {
        expect(whatPartOfDay(12)).toBe("Daylight");
    });

    test("hour 18 → Night", () => {
        expect(whatPartOfDay(18)).toBe("Night");
    });

    test("hour 3 → Night", () => {
        expect(whatPartOfDay(3)).toBe("Night");
    });

    test("hour -1 → Undetermined", () => {
        expect(whatPartOfDay(-1)).toBe("Undetermined");
    });

    test("hour 25 → Undetermined", () => {
        expect(whatPartOfDay(25)).toBe("Undetermined");
    });
});