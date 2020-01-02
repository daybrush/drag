import { IObject } from "@daybrush/utils";

/**
 * @typedef
 * @memberof Dragger
 */
export interface Client {
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Dragger
 */
export interface Dist {
    distX: number;
    distY: number;
}
/**
 * @typedef
 * @memberof Dragger
 */
export interface Delta {
    deltaX: number;
    deltaY: number;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Client
 * @extends Dragger.Dist
 * @extends Dragger.Delta
 */
export interface Position extends Client, Dist, Delta {}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 */
export interface OnDragStart extends Position {
    datas: IObject<any>;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 */
export interface OnDrag extends Position {
    datas: IObject<any>;
    isScroll: boolean;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 */
export interface OnDragEnd extends Position {
    isDrag: boolean;
    datas: IObject<any>;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 */
export interface OnPinchStart extends Position {
    datas: IObject<any>;
    touches: Position[];
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 */
export interface OnPinch extends Position {
    datas: IObject<any>;
    touches: Position[];
    scale: number;
    distance: number;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 */
export interface OnPinchEnd extends Position {
    isPinch: boolean;
    datas: IObject<any>;
    touches: Position[];
    inputEvent: any;
}

/**
 * @typedef
 * @memberof Dragger
 */
export interface DragOptions {
    container?: Window | Node | Element;
    events?: Array<"mouse" | "touch">;
    preventRightClick?: boolean;
    preventDefault?: boolean;
    pinchThreshold?: number;
    dragstart?: (options: OnDragStart) => any;
    drag?: (options: OnDrag) => any;
    dragend?: (options: OnDragEnd) => any;
    pinchstart?: (options: OnPinchStart) => any;
    pinch?: (options: OnPinch) => any;
    pinchend?: (options: OnPinchEnd) => any;
}
