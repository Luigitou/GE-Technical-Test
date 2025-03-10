import {EClockEditModes, IClockModel} from "../interfaces/IClockModel";

export class ClockModel implements IClockModel {
    private readonly id: number;
    private editMode: EClockEditModes;
    private hours: number;
    private minutes: number;
    private seconds: number;
    private hoursOffset: number;
    private minutesOffset: number;
    private timezoneOffset: number;

    constructor(id: number, timezoneOffset?: number) {
        this.id = id;
        this.hoursOffset = 0;
        this.minutesOffset = 0;
        this.editMode = EClockEditModes.View;
        timezoneOffset ? this.timezoneOffset = timezoneOffset : this.timezoneOffset = this.getLocalTimezoneOffset();
        this.updateTime();
    }

    public getId(): number {
        return this.id;
    }

    public incrementHours(): void {
        this.hoursOffset = (this.hoursOffset + 1) % 24;
    }

    public incrementMinutes(): void {
        this.minutesOffset = this.minutesOffset + 1;
        if (this.minutesOffset >= 60) {
            this.minutesOffset = 0;
            this.incrementHours();
        }
    }

    public toggleEditMode(): void {
        switch (this.editMode) {
            case EClockEditModes.View:
                this.editMode = EClockEditModes.EditHours;
                break;
            case EClockEditModes.EditHours:
                this.editMode = EClockEditModes.EditMinutes;
                break;
            case EClockEditModes.EditMinutes:
                this.editMode = EClockEditModes.View;
                break;
        }
    }

    public getEditMode(): EClockEditModes {
        return this.editMode;
    }

    public updateTime(): void {
        const currentDate = new Date();
        this.seconds = currentDate.getUTCSeconds();

        const modelMinutes = currentDate.getUTCMinutes() + this.minutesOffset;
        this.minutes = modelMinutes % 60;

        const modelHours = currentDate.getUTCHours() + this.hoursOffset + this.timezoneOffset + Math.floor(modelMinutes / 60);
        this.hours = ((modelHours % 24) + 24) % 24;
    }

    public getTime(): { hours: number; minutes: number; seconds: number } {
        return {hours: this.hours, minutes: this.minutes, seconds: this.seconds};
    }

    public resetTime() {
        this.hoursOffset = 0;
        this.minutesOffset = 0;
    }

    public setTimezoneOffset(offset: number) {
        this.timezoneOffset = offset;
    }

    public getTimezoneOffset(): number {
        return this.timezoneOffset;
    }

    private getLocalTimezoneOffset(): number {
        const currentDate = new Date();
        console.log(currentDate.getTimezoneOffset());
        return currentDate.getTimezoneOffset() % 60;
    }

}