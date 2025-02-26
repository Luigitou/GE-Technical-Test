export enum EClockEditModes {
    View,
    EditHours,
    EditMinutes,
}

export interface IClockModel {

    getId(): number;

    incrementHours(): void;

    incrementMinutes(): void;

    toggleEditMode(): void;

    getEditMode(): EClockEditModes;

    updateTime(): void;

    getTime(): { hours: number; minutes: number; seconds: number; };

    resetTime(): void;

    setTimezoneOffset(offset: number): void;

    getTimezoneOffset(): number;

}