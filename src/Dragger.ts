import { DragOptions, Client, Position, OnDrag } from "./types";
import {
    getPositionEvent, getPosition, getClients, getPositions,
    isMultiTouch, getPinchDragPosition, getAverageClient, getDist,
} from "./utils";
import { addEvent, removeEvent } from "@daybrush/utils";

/**
 * You can set up drag events in any browser.
 */
class Dragger {
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
    private customDist = [0, 0];
    private targets: Array<Element | Window> = [];
    /**
     *
     */
    constructor(targets: Array<Element | Window> | Element | Window, options: DragOptions = {}) {
        const elements = [].concat(targets as any) as Array<Element | Window> ;
        this.options = {
            container: elements.length > 1 ? window : elements[0],
            preventRightClick: true,
            preventDefault: true,
            pinchThreshold: 0,
            events: ["touch", "mouse"],
            ...options,
        };

        const { container, events } = this.options;

        this.isTouch = events!.indexOf("touch") > -1;
        this.isMouse = events!.indexOf("mouse") > -1;
        this.customDist = [0, 0];
        this.targets = elements;

        if (this.isMouse) {
            elements.forEach(el => {
                addEvent(el, "mousedown", this.onDragStart);
            });
            addEvent(container!, "mousemove", this.onDrag);
            addEvent(container!, "mouseup", this.onDragEnd);
        }
        if (this.isTouch) {
            const passive = {
                passive: false,
            };
            elements.forEach(el => {
                addEvent(el, "touchstart", this.onDragStart, passive);
            });
            addEvent(container!, "touchmove", this.onDrag, passive);
            addEvent(container!, "touchend", this.onDragEnd, passive);
            addEvent(container!, "touchcancel", this.onDragEnd, passive);
        }
    }
    /**
     *
     */
    public isDragging() {
        return this.isDrag;
    }
    /**
     *
     */
    public isFlag() {
        return this.flag;
    }
    /**
     *
     */
    public isPinchFlag() {
        return this.pinchFlag;
    }
    /**
     *
     */
    public isPinching() {
        return this.isPinch;
    }
    /**
     *
     */
    public scrollBy(deltaX: number, deltaY: number, e: any, isCallDrag: boolean = true) {
        if (!this.flag) {
            return;
        }
        this.startClients.forEach(client => {
            client.clientX -= deltaX;
            client.clientY -= deltaY;
        });
        this.prevClients.forEach(client => {
            client.clientX -= deltaX;
            client.clientY -= deltaY;
        });
        isCallDrag && this.onDrag(e, true);
    }
    /**
     * @method
     */
    public onDragStart = (e: any) => {
        if (!this.flag && e.cancelable === false) {
            return;
        }
        const { container, pinchOutside, dragstart, preventRightClick } = this.options;
        const isTouch = this.isTouch;

        if (!this.flag && isTouch && pinchOutside) {
            setTimeout(() => {
                addEvent(container!, "touchstart", this.onDragStart);
            });
        }
        if (this.flag && isTouch && pinchOutside) {
            removeEvent(container!, "touchstart", this.onDragStart);
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

        this.customDist = [0, 0];
        this.flag = true;
        this.isDrag = false;
        this.startClients = clients;
        this.prevClients = clients;
        this.datas = {};
        this.movement = 0;

        const position = getPosition(clients[0], this.prevClients[0], this.startClients[0]);

        if (
            (preventRightClick && e.which === 3)
            || (dragstart && dragstart({
                type: "dragstart",
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
    public onDrag = (e: any, isScroll?: boolean) => {
        if (!this.flag) {
            return;
        }
        const clients = getPositionEvent(e);

        if (this.pinchFlag) {
            this.onPinch(e, clients);
        }
        const result = this.move([0, 0], e, clients);

        if (!result || (!result.deltaX && !result.deltaY)) {
            return;
        }
        const drag = this.options.drag;

        drag && drag({
            ...result,
            isScroll: !!isScroll,
            inputEvent: e,
        });
    }
    public move([deltaX, deltaY]: number[], inputEvent: any, clients = this.prevClients): OnDrag | undefined {
        const customDist = this.customDist;
        const prevClients = this.prevClients;
        const startClients = this.startClients;
        const position: Position = this.pinchFlag
            ? getPinchDragPosition(clients, prevClients, startClients, this.startPinchClients)
            : getPosition(clients[0], prevClients[0], startClients[0]);

        customDist[0] += deltaX;
        customDist[1] += deltaY;
        position.deltaX += deltaX;
        position.deltaY += deltaY;

        const {
            deltaX: positionDeltaX,
            deltaY: positionDeltaY,
        } = position;

        position.distX += customDist[0];
        position.distY += customDist[1];

        this.movement += Math.sqrt(positionDeltaX * positionDeltaX + positionDeltaY * positionDeltaY);
        this.prevClients = clients;
        this.isDrag = true;

        return {
            type: "drag",
            datas: this.datas,
            ...position,
            movement: this.movement,
            isDrag: this.isDrag,
            isPinch: this.isPinch,
            isScroll: false,
            inputEvent,
        };
    }
    public onDragEnd = (e: any) => {
        if (!this.flag) {
            return;
        }
        const { dragend, pinchOutside, container } = this.options;
        if (this.isTouch && pinchOutside) {
            removeEvent(container!, "touchstart", this.onDragStart);
        }
        if (this.pinchFlag) {
            this.onPinchEnd(e);
        }
        this.flag = false;

        const prevClients = this.prevClients;
        const startClients = this.startClients;

        const position: Position = this.pinchFlag
            ? getPinchDragPosition(prevClients, prevClients, startClients, this.startPinchClients)
            : getPosition(prevClients[0], prevClients[0], startClients[0]);

        this.startClients = [];
        this.prevClients = [];
        dragend && dragend({
            type: "dragend",
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
            type: "pinchstart",
            datas: this.datas,
            touches: getPositions(startClients, startClients, startClients),
            ...centerPosition,
            inputEvent: e,
        });
    }
    public onPinch(e: TouchEvent, clients: Client[]) {
        if (!this.flag || !this.pinchFlag || clients.length < 2) {
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
            type: "pinch",
            datas: this.datas,
            movement: this.movement,
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
            type: "pinchend",
            datas: this.datas,
            isPinch,
            touches: getPositions(prevClients, prevClients, startClients),
            ...centerPosition,
            inputEvent: e,
        });
        this.isPinch = false;
        this.pinchFlag = false;
    }
    /**
     *
     */
    public unset() {
        const targets = this.targets;
        const container = this.options.container!;

        if (this.isMouse) {
            targets.forEach(target => {
                removeEvent(target, "mousedown", this.onDragStart);
            });
            removeEvent(container, "mousemove", this.onDrag);
            removeEvent(container, "mouseup", this.onDragEnd);
        }
        if (this.isTouch) {
            targets.forEach(target => {
                removeEvent(target, "touchstart", this.onDragStart);
            });
            removeEvent(container, "touchstart", this.onDragStart);
            removeEvent(container, "touchmove", this.onDrag);
            removeEvent(container, "touchend", this.onDragEnd);
            removeEvent(container, "touchcancel", this.onDragEnd);
        }
    }
}

export default Dragger;
