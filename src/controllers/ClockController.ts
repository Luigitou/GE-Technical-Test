import {ClockModel} from "../models/ClockModel";
import {ClockView} from "../views/Clock";
import {ButtonView} from "../views/Buttons";
import {EClockEditModes} from "../interfaces/IClockModel";
import {IClockController} from "../interfaces/IClockController";
import {TimezoneSelectorView} from "../views/TimezoneSelector";

type ClocksManager = {
    model: ClockModel;
    view: ClockView;
}

export class ClockController implements IClockController {
    public static instance: ClockController;
    private clocks: ClocksManager[] = [];
    private clocksContainer: HTMLElement;
    private clockId = 0;


    private constructor() {
        this.clocksContainer = document.getElementById("clocks-container");
        this.addClock();
        this.startClock();
    }

    public static getInstance() {
        if (!ClockController.instance) {
            ClockController.instance = new ClockController();
        }
        return ClockController.instance;
    }

    public addClock(timezoneOffset?: number): void {
        const id = this.clockId++;

        // Clock wrapper to attach buttons
        const clockWrapper = document.createElement("div");
        clockWrapper.classList.add("clock-wrapper");
        clockWrapper.id = `wrapper-${id}`;
        clockWrapper.setAttribute("draggable", "true");
        this.clocksContainer.appendChild(clockWrapper);

        // Clock element
        const clockElement = document.createElement("div");
        clockElement.id = id.toString();
        clockElement.classList.add("clock-display");
        clockWrapper.appendChild(clockElement);

        // Clock model and view
        const clockModel = timezoneOffset ? new ClockModel(id, timezoneOffset) : new ClockModel(id);
        const clockView = new ClockView(id.toString());
        this.clocks.push({model: clockModel, view: clockView});
        const renderData = {...clockModel.getTime(), editMode: clockModel.getEditMode()};
        clockView.render(renderData);

        // Buttons to go with the clock
        new ButtonView(`wrapper-${id}`, "Mode", () => {
            clockModel.toggleEditMode();
        }, "mode-button");
        new ButtonView(`wrapper-${id}`, "+", () => {
            if (clockModel.getEditMode() === EClockEditModes.EditHours) {
                clockModel.incrementHours();
            } else if (clockModel.getEditMode() === EClockEditModes.EditMinutes) {
                clockModel.incrementMinutes();
            }
        }, "increase-button");
        new ButtonView(`wrapper-${id}`, "Light", () => {
            clockView.toggleLight();
        }, "light-button");
        new ButtonView(`wrapper-${id}`, "Reset", () => {
            clockModel.resetTime();
        }, "reset-button");
        new ButtonView(`wrapper-${id}`, "AM/PM", () => {
            clockView.toggleAmPm();
        }, "am-pm-button");
        new ButtonView(`wrapper-${id}`, "X", () => {
            this.deleteClock(id);
        }, "delete-button");

        // Timezone selector
        new TimezoneSelectorView(`${id}`, clockModel.getTimezoneOffset(), (timezone) => {
            clockModel.setTimezoneOffset(timezone);
        });

    }

    private deleteClock(id: number) {
        const clockElement = document.getElementById(`wrapper-${id}`);
        if (clockElement) {
            clockElement.remove();
        }
        this.clocks = this.clocks.filter((clock) => clock.model.getId() !== id);
    }

    private startClock() {
        setInterval(() => {
            this.clocks.forEach((clock) => {
                clock.model.updateTime();
                const {hours, minutes, seconds} = clock.model.getTime();
                clock.view.render({hours, minutes, seconds, editMode: clock.model.getEditMode()});
            })
        }, 250);
    }
}