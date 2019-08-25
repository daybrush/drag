import { DragOptions, Client, Position } from "./types";
import {
    getPositionEvent, getPosition, getClients, getPositions,
    isMultiTouch, getPinchDragPosition, getAverageClient, getDist,
} from "./utils";
import { addEvent, removeEvent } from "@daybrush/utils";

export default class Dragger {
    public options: DragOptions = {};
    private flag = false;
    private pinchFlag = false;
    private datas = {};
    private isDrag = false;
    private isPinch = false;
    private isMouse = false;
    private isTouch = false;
    private prevClients: Client[] = [];
    private startClients: Client[] = [];
    private movement: number = 0;
    private startPinchClients: Client[] = [];
    private startDistance: number = 0;

    constructor(private el: Element, options: DragOptions = {}) {
        this.options = {
            container: el,
            preventRightClick: true,
            pinchThreshold: 0,
            events: ["touch", "mouse"],
            ...options,
        };

        const { container, events } = this.options;

        this.isTouch = events!.indexOf("touch") > -1;
        this.isMouse = events!.indexOf("mouse") > -1;

        if (this.isMouse) {
            addEvent(el, "mousedown", this.onDragStart);
            addEvent(container!, "mousemove", this.onDrag);
            addEvent(container!, "mouseup", this.onDragEnd);
        }
        if (this.isTouch) {
            addEvent(el, "touchstart", this.onDragStart);
            addEvent(container!, "touchmove", this.onDrag);
            addEvent(container!, "touchend", this.onDragEnd);
        }
    }
    public isDragging() {
        return this.isDrag;
    }
    public isPinching() {
        return this.isPinch;
    }
    public onDragStart = (e: any) => {
        if (!this.flag && e.cancelable === false) {
            return;
        }
        if (isMultiTouch(e)) {
            if (!this.flag && (e.touches.length !== e.changedTouches.length)) {
                return;
            }
            if (!this.pinchFlag) {
                this.onPinchStart(e);
            }
        }
        if (this.flag) {
            return;
        }
        const clients = this.startClients[0] ? this.startClients : getPositionEvent(e);

        this.flag = true;
        this.isDrag = false;
        this.startClients = clients;
        this.prevClients = clients;
        this.datas = {};
        this.movement = 0;

        const position = getPosition(clients[0], this.prevClients[0], this.startClients[0]);

        const {
            dragstart,
            preventRightClick,
        } = this.options;

        if (
            (preventRightClick && e.which === 3)
            || (dragstart && dragstart({
                datas: this.datas,
                inputEvent: e,
                ...position,
            })) === false) {
            this.startClients = [];
            this.prevClients = [];
            this.flag = false;
        }
        this.flag && e.preventDefault();
    }
    public onDrag = (e: any) => {
        if (!this.flag) {
            return;
        }
        const clients = getPositionEvent(e);

        if (this.pinchFlag) {
            this.onPinch(e, clients);
        }
        const prevClients = this.prevClients;
        const startClients = this.startClients;
        const position: Position = this.pinchFlag
            ? getPinchDragPosition(clients, prevClients, startClients, this.startPinchClients)
            : getPosition(clients[0], prevClients[0], startClients[0]);

        const { deltaX, deltaY } = position;
        if (!deltaX && !deltaY) {
            return;
        }
        this.movement += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        this.isDrag = true;

        const drag = this.options.drag;
        drag && drag({
            datas: this.datas,
            ...position,
            inputEvent: e,
        });
        this.prevClients = clients;
    }
    public onDragEnd = (e: any) => {
        if (!this.flag) {
            return;
        }
        if (this.pinchFlag) {
            this.onPinchEnd(e);
        }
        this.flag = false;

        const dragend = this.options.dragend;
        const prevClients = this.prevClients;
        const startClients = this.startClients;

        const position: Position = this.pinchFlag
            ? getPinchDragPosition(prevClients, prevClients, startClients, this.startPinchClients)
            : getPosition(prevClients[0], prevClients[0], startClients[0]);

        this.startClients = [];
        this.prevClients = [];
        dragend && dragend({
            datas: this.datas,
            isDrag: this.isDrag,
            inputEvent: e,
            ...position,
        });
    }
    public onPinchStart(e: TouchEvent) {
        const { pinchstart, pinchThreshold } = this.options;

        if (this.isDrag && this.movement > pinchThreshold!) {
            return;
        }
        const pinchClients = getClients(e.changedTouches);

        this.pinchFlag = true;
        this.startClients.push(...pinchClients);
        this.prevClients.push(...pinchClients);
        this.startDistance = getDist(this.prevClients);
        this.startPinchClients = [...this.prevClients];

        if (!pinchstart) {
            return;
        }
        const startClients = this.prevClients;
        const startAverageClient = getAverageClient(startClients);
        const centerPosition = getPosition(
            startAverageClient,
            startAverageClient,
            startAverageClient,
        );
        pinchstart({
            datas: this.datas,
            touches: getPositions(startClients, startClients, startClients),
            ...centerPosition,
            inputEvent: e,
        });
    }
    public onPinch(e: TouchEvent, clients: Client[]) {
        if (!this.flag || !this.pinchFlag) {
            return;
        }
        this.isPinch = true;

        const pinch = this.options.pinch;
        if (!pinch) {
            return;
        }
        const prevClients = this.prevClients;
        const startClients = this.startClients;
        const centerPosition = getPosition(
            getAverageClient(clients),
            getAverageClient(prevClients),
            getAverageClient(startClients),
        );
        const distance = getDist(clients);
        pinch({
            datas: this.datas,
            touches: getPositions(clients, prevClients, startClients),
            scale: distance / this.startDistance,
            distance,
            ...centerPosition,
            inputEvent: e,
        });
    }
    public onPinchEnd(e: TouchEvent) {
        if (!this.flag || !this.pinchFlag) {
            return;
        }
        const isPinch = this.isPinch;

        this.isPinch = false;
        this.pinchFlag = false;
        const pinchend = this.options.pinchend;

        if (!pinchend) {
            return;
        }
        const prevClients = this.prevClients;
        const startClients = this.startClients;
        const centerPosition = getPosition(
            getAverageClient(prevClients),
            getAverageClient(prevClients),
            getAverageClient(startClients),
        );
        pinchend({
            datas: this.datas,
            isPinch,
            touches: getPositions(prevClients, prevClients, startClients),
            ...centerPosition,
            inputEvent: e,
        });
        this.isPinch = false;
        this.pinchFlag = false;
    }
    public unset() {
        const el = this.el;
        const container = this.options.container!;

        if (this.isMouse) {
            removeEvent(el, "mousedown", this.onDragStart);
            removeEvent(container as any, "mousemove", this.onDrag);
            removeEvent(container as any, "mouseup", this.onDragEnd);
        }
        if (this.isTouch) {
            removeEvent(el, "touchstart", this.onDragStart);
            removeEvent(container as any, "touchmove", this.onDrag);
            removeEvent(container as any, "touchend", this.onDragEnd);
        }
    }
}
