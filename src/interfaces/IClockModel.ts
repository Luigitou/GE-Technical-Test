export enum EClockEditModes {
    View,
    EditHours,
    EditMinutes,
}

export interface IClockModel {
    id: number;
    editMode: EClockEditModes;

    hours: number;
    minutes: number;
    seconds: number;

    hoursOffset: number;
    minutesOffset: number;

    incrementHours(): void;

    incrementMinutes(): void;

    toggleEditMode(): void;

    getEditMode(): EClockEditModes;

    getTime(): { hours: number; minutes: number; seconds: number; };

    updateTime(): void;

    resetTime(): void;

}