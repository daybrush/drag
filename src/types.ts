import { IObject } from "@daybrush/utils";

export interface Client {
    clientX: number;
    clientY: number;
}
export interface Dist {
    distX: number;
    distY: number;
}
export interface Delta {
    deltaX: number;
    deltaY: number;
}
export interface Position extends Client, Dist, Delta {}
export interface OnDragStart extends Position {
    datas: IObject<any>;
    inputEvent: any;
}
export interface OnDrag extends Position {
    datas: IObject<any>;
    isScroll: boolean;
    inputEvent: any;
}
export interface OnDragEnd extends Position {
    isDrag: boolean;
    datas: IObject<any>;
    inputEvent: any;
}
export interface OnPinchStart extends Position {
    datas: IObject<any>;
    touches: Position[];
    inputEvent: any;
}
export interface OnPinch extends Position {
    datas: IObject<any>;
    touches: Position[];
    scale: number;
    distance: number;
    inputEvent: any;
}
export interface OnPinchEnd extends Position {
    isPinch: boolean;
    datas: IObject<any>;
    touches: Position[];
    inputEvent: any;
}

export interface DragOptions {
    container?: Window | Node | Element;
    events?: Array<"mouse" | "touch">;
    preventRightClick?: boolean;
    pinchThreshold?: number;
    dragstart?: (options: OnDragStart) => any;
    drag?: (options: OnDrag) => any;
    dragend?: (options: OnDragEnd) => any;
    pinchstart?: (options: OnPinchStart) => any;
    pinch?: (options: OnPinch) => any;
    pinchend?: (options: OnPinchEnd) => any;
}
