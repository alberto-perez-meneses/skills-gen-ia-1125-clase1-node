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
    test("hour 0 → Night", () => {
        expect(whatPartOfDay(0)).toBe("Night");
    });
    test("hour 6 → Night", () => {
        expect(whatPartOfDay(6)).toBe("Night");
    });
    test("hour 17 → Daylight", () => {
        expect(whatPartOfDay(17)).toBe("Daylight");
    });
    test("hour 23 → Night", () => {
        expect(whatPartOfDay(23)).toBe("Night");
    });
    test("hour null → Undetermined", () => {
        expect(whatPartOfDay(null)).toBe("Undetermined");
    });
    test("hour undefined → Undetermined", () => {
        expect(whatPartOfDay(undefined)).toBe("Undetermined");
    });
    test("hour '7' → Undetermined", () => {
        expect(whatPartOfDay("7")).toBe("Undetermined");
    });
    test("hour 'abc' → Undetermined", () => {
        expect(whatPartOfDay("abc")).toBe("Undetermined");
    });
    test("hour {} → Undetermined", () => {
        expect(whatPartOfDay({})).toBe("Undetermined");
    });
    test("hour 7.5 → Undetermined", () => {
        expect(whatPartOfDay(7.5)).toBe("Undetermined");
    });
    test("hour 12.3 → Undetermined", () => {
        expect(whatPartOfDay(12.3)).toBe("Undetermined");
    });
});