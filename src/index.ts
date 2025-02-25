import "./index.css";
import {ClockController} from "./controllers/ClockController";
import "./utils/DragDrop";

document.addEventListener('DOMContentLoaded', () => {
    const clockController = ClockController.getInstance();

    document.getElementById("add-clock").addEventListener("click", () => {
        clockController.addClock();
    });
});