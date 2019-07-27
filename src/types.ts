import { IObject } from "@daybrush/utils";

export interface OnDragStart {
    datas: IObject<any>;
    clientX: number;
    clientY: number;
    inputEvent: any;
}
export interface OnDrag {
    datas: IObject<any>;
    distX: number;
    distY: number;
    deltaX: number;
    deltaY: number;
    clientX: number;
    clientY: number;
    inputEvent: any;
}
export interface OnDragEnd {
    isDrag: boolean;
    datas: IObject<any>;
    inputEvent: any;
    clientX: number;
    clientY: number;
    distX: number;
    distY: number;
}
export interface DragOptions {
    container?: Window | Node | Element;
    events?: Array<"mouse" | "touch">;
    preventRightClick?: boolean;
    dragstart?: (options: OnDragStart) => any;
    drag?: (options: OnDrag) => any;
    dragend?: (options: OnDragEnd) => any;
}
