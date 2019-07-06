import { IObject } from "@daybrush/utils";

export interface DragOptions {
    container?: Window | Node | Element;
    events?: Array<"mouse" | "touch">;
    dragstart?: (options: {
        datas: IObject<any>,
        clientX: number,
        clientY: number,
        inputEvent: any,
    }) => any;
    drag?: (options: {
        datas: IObject<any>,
        distX: number,
        distY: number,
        deltaX: number,
        deltaY: number,
        clientX: number,
        clientY: number,
        inputEvent: any,
    }) => any;
    dragend?: (options: {
        isDrag: boolean,
        datas: IObject<any>,
        inputEvent: any,
        clientX: number,
        clientY: number,
        distX: number,
        distY: number,
    }) => any;
}
