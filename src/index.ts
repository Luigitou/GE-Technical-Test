import "./index.css";
import {ClockController} from "./controllers/ClockController";
import "./utils/DragDrop";

document.addEventListener('DOMContentLoaded', () => {
    const clockController = ClockController.getInstance();

    document.getElementById("add-clock").addEventListener("click", () => {
        const timezoneInput = prompt("Please input the timezone you want : GMT+X");
        const timezone = parseInt(timezoneInput || "", 10);

        if (isNaN(timezone) || timezone < -12 || timezone > 14) {
            alert("Please enter a valid timezone.");
        } else {
            clockController.addClock(timezone);
        }
    });
});