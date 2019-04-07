import { IObject } from "@daybrush/utils";

export interface DragOptions {
    container?: HTMLElement;
    events?: Array<"mouse" | "touch">;
    dragstart?: (options: {datas: IObject<any>, inputEvent: any}) => any;
    drag?: (options: {
        datas: IObject<any>, deltaX: number, deltaY: number, clientX: number, clientY: number, inputEvent}) => any;
    dragend?: (options: {datas: IObject<any>, inputEvent: any}) => any;
  }
