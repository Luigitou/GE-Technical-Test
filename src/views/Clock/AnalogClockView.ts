import {IView} from "../../interfaces/IView";

export type AnalogClockViewRenderProps = {
    hours: number;
    minutes: number;
    seconds: number;
}

export class AnalogClockView implements IView {
    private container: HTMLElement;
    private readonly element: HTMLElement;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found.`);
        }
        this.container = container;
        this.element = document.createElement("div");
        this.element.classList.add("clock-screen-analog");
        this.container.appendChild(this.element);
    }

    public render({hours, minutes, seconds}: AnalogClockViewRenderProps): void {
        this.element.innerHTML = `
        <div class="clock">
            <div class="clock-face">
                <div class="hand hour" style="transform: rotate(${hours * 30}deg)"></div>
                <div class="hand minute" style="transform: rotate(${minutes * 6}deg)"></div>
                <div class="hand second" style="transform: rotate(${seconds * 6}deg)"></div>
            </div>
        </div>
        `;
    }
}