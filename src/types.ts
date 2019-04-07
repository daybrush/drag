import { IObject } from "@daybrush/utils";

export interface DragOptions {
    container?: HTMLElement;
    dragstart?: (options: {datas: IObject<any>}) => any;
    drag?: (options: {datas: IObject<any>, deltaX: number, deltaY: number, clientX: number, clientY: number}) => any;
    dragend?: (options: {datas: IObject<any>}) => any;
  }
