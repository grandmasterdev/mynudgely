import * as cut from "./../../src/utils/cron-utils";

describe("cron utils tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a cron string for aws event rule', () => {
        expect(cut.convertStorePropsIntervalToCron('minutes', 10)).toBe("cron(0/10 * * * ? *)");
        expect(cut.convertStorePropsIntervalToCron('hours', 3)).toBe("cron(0 0/3 * * ? *)");
        expect(cut.convertStorePropsIntervalToCron('days', 16)).toBe("cron(0 0 1/16 * ? *)");
        expect(cut.convertStorePropsIntervalToCron('weeks', 2)).toBe("cron(0 0 ? * 2 *)");
    });

    it('should throw an exception if the value of minutes exceed 59', () => {
        expect(() => {
            cut.convertStorePropsIntervalToCron('minutes',60)
        }).toThrow('Interval minute has to be lower than 60');
    });

    it('should throw an exception if the value of hours exceed 24', () => {
        expect(() => {
            cut.convertStorePropsIntervalToCron('hours',60)
        }).toThrow('Interval hour has to be lower than 24');
    });

    it('should throw an exception if the value of days exceed 30', () => {
        expect(() => {
            cut.convertStorePropsIntervalToCron('days',32)
        }).toThrow('Interval day has to be lower than 31');
    });

    it('should throw an exception if the type is not of the value allowed', () => {
        expect(() => {
            cut.convertStorePropsIntervalToCron('year' as any,1)
        }).toThrow('Invalid type');
    })
})