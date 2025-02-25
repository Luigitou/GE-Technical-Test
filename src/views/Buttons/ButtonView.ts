import "./button.css";
import {IView} from "../../interfaces/IView";

export class ButtonView implements IView {
    private container: HTMLElement;
    private readonly element: HTMLElement;
    private readonly label: string;

    constructor(containerId: string, label: string, callback: () => void, classname: string) {
        const element = document.getElementById(`${containerId}`);
        if (!element) {
            throw new Error(`Container with id "${containerId}" not found.`);
        }
        this.container = element;
        this.element = document.createElement("button");
        this.element.classList.add("button", classname);
        this.container.appendChild(this.element);
        this.label = label;
        this.element.addEventListener("click", callback);
        this.render();
    }

    public render(): void {
        this.element.innerHTML = this.label;
    }
}