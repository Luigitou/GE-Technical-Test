import "./timezoneSelector.css";
import {IView} from "../../interfaces/IView";

export class TimezoneSelectorView implements IView {
    private container: HTMLElement;
    private defaultTimezone: number;
    private selectedTimezone: number;
    private element: HTMLSelectElement;

    constructor(containerId: string, defaultTimezone: number, callback: (timezone: number) => void) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found.`);
        }
        this.defaultTimezone = defaultTimezone;
        this.selectedTimezone = 0;
        const select = document.createElement("select");
        select.id = "timezone-selector";
        select.classList.add("timezone-selector");
        this.container.appendChild(select);
        select.addEventListener("change", () => {
            this.selectedTimezone = parseInt(select.value);
            callback(this.selectedTimezone);
        });
        this.element = select;
        this.render();
    }

    public render() {
        for (let offset = -12; offset <= 14; offset++) {
            const option = document.createElement("option");
            option.value = offset.toString();

            let displayText: string;
            if (offset > 0) {
                displayText = `GMT+${offset}`;
            } else if (offset < 0) {
                displayText = `GMT${offset}`;
            } else {
                displayText = "GMT";
            }
            option.textContent = displayText;

            if (offset === this.defaultTimezone) {
                option.selected = true;
            }

            this.element.appendChild(option);
        }
    }

}