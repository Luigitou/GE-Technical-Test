import {ClockModel} from "../models/ClockModel";
import {ClockView} from "../views/Clock";
import {ButtonView} from "../views/Buttons";
import {EClockEditModes} from "../interfaces/IClockModel";
import {IClockController} from "../interfaces/IClockController";
import {TimezoneSelectorView} from "../views/TimezoneSelector";
import {IView} from "../interfaces/IView";
import {AnalogClockView} from "../views/Clock/AnalogClockView";

type ClocksManager = {
    model: ClockModel;
    view: IView;
    isAnalog: boolean;
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

        // Clock section wrapper
        const clockSection = document.createElement("section");
        clockSection.classList.add("clock-section");
        clockSection.id = `section-${id}`;
        this.clocksContainer.appendChild(clockSection);

        // Delete & Analog buttons div
        const buttonsDiv = document.createElement("div");
        buttonsDiv.id = `buttons-div-${id}`;
        buttonsDiv.classList.add("buttons-div");
        clockSection.appendChild(buttonsDiv);

        // Clock wrapper to attach buttons
        const clockWrapper = document.createElement("div");
        clockWrapper.classList.add("clock-wrapper");
        clockWrapper.id = `wrapper-${id}`;
        clockWrapper.setAttribute("draggable", "true");
        clockSection.appendChild(clockWrapper);

        // Clock element
        const clockElement = document.createElement("div");
        clockElement.id = id.toString();
        clockElement.classList.add("clock-display");
        clockWrapper.appendChild(clockElement);

        // Clock model and view
        const clockModel = timezoneOffset ? new ClockModel(id, timezoneOffset) : new ClockModel(id);
        const clockView = new ClockView(id.toString());
        this.clocks.push({model: clockModel, view: clockView, isAnalog: false});
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
        new ButtonView(`buttons-div-${id}`, "Delete", () => {
            this.deleteClock(id);
        }, "delete-button");
        new ButtonView(`buttons-div-${id}`, "Analog", () => {
            this.toggleAnalog(id);
        }, "analog-button");

        // Timezone selector
        new TimezoneSelectorView(`wrapper-${id}`, clockModel.getTimezoneOffset(), (timezone) => {
            clockModel.setTimezoneOffset(timezone);
        });

    }

    private deleteClock(id: number) {
        const clockElement = document.getElementById(`section-${id}`);
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

    private toggleAnalog(id: number) {
        const currentClock = this.clocks.find((clock) => clock.model.getId() === id);
        currentClock.isAnalog = !currentClock.isAnalog;

        // Clean previous clock
        const clockElement = document.getElementById(id.toString());
        if (clockElement) {
            clockElement.innerHTML = "";
        }

        const buttons = document.querySelectorAll(`#wrapper-${id} button, #wrapper-${id} select`);
        // remove clock style and delete button from the list
        const filteredButton = Array.from(buttons).filter(btn =>
            !btn.classList.contains("analog-button") && !btn.classList.contains("delete-button")
        );

        if (currentClock.isAnalog) {
            // Hide buttons
            filteredButton.forEach((button) => {
                button.classList.add("hidden");
            });

            const analogClock = new AnalogClockView(id.toString());
            currentClock.view = analogClock;
            analogClock.render(currentClock.model.getTime());

            // Change label of the button
            const analogButton = document.querySelector(`#buttons-div-${id} .analog-button`);
            if (analogButton) {
                analogButton.textContent = "Digital";
            }
        } else {
            // Show buttons
            filteredButton.forEach((button) => {
                button.classList.remove("hidden");
            });

            const digitalClock = new ClockView(id.toString());
            currentClock.view = digitalClock;
            digitalClock.render({...currentClock.model.getTime(), editMode: currentClock.model.getEditMode()});

            // Change label of the button
            const analogButton = document.querySelector(`#buttons-div-${id} .analog-button`);
            if (analogButton) {
                analogButton.textContent = "Analog";
            }

            // Delete and rebind am/pm & light button
            // TODO: Better option would be to have both views and to switch between them
            const amPmButton = document.querySelector(`#wrapper-${id} .am-pm-button`);
            if (amPmButton) {
                amPmButton.remove();
                new ButtonView(`wrapper-${id}`, "AM/PM", () => {
                    digitalClock.toggleAmPm();
                }, "am-pm-button");
            }
            const lightButton = document.querySelector(`#wrapper-${id} .light-button`);
            if (lightButton) {
                lightButton.remove();
                new ButtonView(`wrapper-${id}`, "Light", () => {
                    digitalClock.toggleLight();
                }, "light-button");
            }
        }
    }
}