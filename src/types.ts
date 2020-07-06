import { IObject } from "@daybrush/utils";

/**
 * @typedef
 * @memberof Dragger
 */
export interface Event {
    type: string;
}

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
 * @extends Dragger.Event
 */
export interface OnDragStart extends Position, Event {
    datas: IObject<any>;
    inputEvent: any;
    isTrusted: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 * @extends Dragger.Event
 */
export interface OnDrag extends Position, Event {
    isDrag: boolean;
    isPinch: boolean;
    movement: number;
    datas: IObject<any>;
    isScroll: boolean;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 * @extends Dragger.Event
 */
export interface OnDragEnd extends Position, Event {
    isDrag: boolean;
    isDouble: boolean;
    datas: IObject<any>;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 * @extends Dragger.Event
 */
export interface OnPinchStart extends Position, Event {
    datas: IObject<any>;
    touches: Position[];
    angle: number;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 * @extends Dragger.Event
 */
export interface OnPinch extends Position, Event {
    datas: IObject<any>;
    touches: Position[];
    rotation: number;
    angle: number;
    scale: number;
    distance: number;
    movement: number;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Dragger
 * @extends Dragger.Position
 * @extends Dragger.Event
 */
export interface OnPinchEnd extends Position, Event {
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
    pinchOutside?: boolean;
    checkInput?: boolean;
    dragstart?: (options: OnDragStart) => any;
    drag?: (options: OnDrag) => any;
    dragend?: (options: OnDragEnd) => any;
    pinchstart?: (options: OnPinchStart) => any;
    pinch?: (options: OnPinch) => any;
    pinchend?: (options: OnPinchEnd) => any;
}
