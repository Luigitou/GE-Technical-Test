import {IView} from "../../interfaces/IView";
import "./analogClock.css";
import {Matrix} from "../../utils/Matrix";

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
        <span class="hand hours"></span>
        <span class="hand minutes"></span>
        <span class="hand seconds"></span>
        `;

        const {hour, minute, second} = this.getAngleForTimeInRad({hours, minutes, seconds});
        const hourHand = this.element.querySelector(".hand.hours") as HTMLElement;
        const minuteHand = this.element.querySelector(".hand.minutes") as HTMLElement;
        const secondHand = this.element.querySelector(".hand.seconds") as HTMLElement;

        if (hourHand && minuteHand && secondHand) {
            const hourMatrix = Matrix.rotationMatrix(hour) as Matrix;
            const minuteMatrix = Matrix.rotationMatrix(minute) as Matrix;
            const secondMatrix = Matrix.rotationMatrix(second) as Matrix;

            hourHand.style.transform = this.matrixToCss(hourMatrix);
            minuteHand.style.transform = this.matrixToCss(minuteMatrix);
            secondHand.style.transform = this.matrixToCss(secondMatrix);
        }
    }

    private getAngleForTimeInRad({hours, minutes, seconds}: AnalogClockViewRenderProps): {
        hour: number,
        minute: number,
        second: number
    } {
        const degToRad = Math.PI / 180;
        return {
            hour: ((hours % 12) * 30 + minutes * 0.5) * degToRad,
            minute: (minutes * 6) * degToRad,
            second: (seconds * 6) * degToRad
        }
    }

    private matrixToCss(matrix: Matrix): string {
        const m = matrix.matrix;
        const a = m[0][0];
        const b = m[1][0];
        const c = m[0][1];
        const d = m[1][1];
        const e = m[0][2];
        const f = m[1][2];
        return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
    }
}