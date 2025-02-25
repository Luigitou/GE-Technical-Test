import "./clock.css";
import {EClockEditModes} from "../../interfaces/IClockModel";
import {IView} from "../../interfaces/IView";

export type ClockViewRenderProps = {
    hours: number;
    minutes: number;
    seconds: number;
    editMode: EClockEditModes;
}

export class ClockView implements IView {
    private container: HTMLElement;
    private readonly element: HTMLElement;
    private amPm: boolean = false;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found.`);
        }
        this.container = container;
        this.element = document.createElement("div");
        this.element.classList.add("clock-screen");
        this.container.appendChild(this.element);
    }

    public render({hours, minutes, seconds, editMode}: ClockViewRenderProps): void {
        this.element.classList.remove("edithours", "editminutes");
        this.element.classList.add(EClockEditModes[editMode].toLowerCase());

        if (this.amPm) {
            const ampm = hours >= 12 ? "PM" : "AM";
            const displayHours = (hours % 12) === 0 ? 12 : hours % 12;
            this.element.innerHTML = `<span>${this.pad(displayHours)}</span>:<span>${this.pad(minutes)}</span>:<span>${this.pad(seconds)}</span>${ampm}`;
        } else {
            this.element.innerHTML = `<span>${this.pad(hours)}</span>:<span>${this.pad(minutes)}</span>:<span>${this.pad(seconds)}</span>`;
        }
    }

    public toggleLight(): void {
        this.element.classList.toggle("light");
    }

    public toggleAmPm(): void {
        this.amPm = !this.amPm;
    }

    private pad(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }

}
