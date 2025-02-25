import {IClockModel} from "./IClockModel";
import {IView} from "./IView";

export interface IClocksArray {
    model: IClockModel;
    view: IView;
}

export interface IClockController {

    addClock(): void;

}