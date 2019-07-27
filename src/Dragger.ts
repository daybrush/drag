import { DragOptions } from "./types";

function getPosition(e) {
    return e.touches && e.touches.length ? e.touches[0] : e;
}

export default class Dragger {
    private flag = false;
    private startX = 0;
    private startY = 0;
    private prevX = 0;
    private prevY = 0;
    private datas = {};
    private options: DragOptions = {};
    private isDrag = false;
    private isMouse = false;
    private isTouch = false;

    constructor(private el: Element, options: DragOptions = {}) {
        this.options = {
            container: el,
            preventRightClick: true,
            events: ["touch", "mouse"],
            ...options,
        };

        const { container, events } = this.options;

        this.isTouch = events.indexOf("touch") > -1;
        this.isMouse = events.indexOf("mouse") > -1;

        if (this.isMouse) {
            el.addEventListener("mousedown", this.onDragStart);
            container.addEventListener("mousemove", this.onDrag);
            container.addEventListener("mouseup", this.onDragEnd);
        }
        if (this.isTouch) {
            el.addEventListener("touchstart", this.onDragStart);
            container.addEventListener("touchmove", this.onDrag);
            container.addEventListener("touchend", this.onDragEnd);
        }
    }
    public isDragging() {
        return this.isDrag;
    }
    public onDragStart = (e: any) => {
        this.flag = true;
        this.isDrag = false;
        const { clientX, clientY } = getPosition(e);

        this.startX = clientX;
        this.startY = clientY;
        this.prevX = clientX;
        this.prevY = clientY;
        this.datas = {};

        const {
            dragstart,
            preventRightClick,
        } = this.options;

        if (
            (preventRightClick && e.which === 3)
            || (dragstart && dragstart({
                datas: this.datas,
                inputEvent: e,
                clientX,
                clientY,
            })) === false) {
            this.flag = false;
        }
        this.flag && e.preventDefault();
    }
    public onDrag = (e: any) => {
        if (!this.flag) {
            return;
        }

        const { clientX, clientY } = getPosition(e);
        const deltaX = clientX - this.prevX;
        const deltaY = clientY - this.prevY;

        if (!deltaX && !deltaY) {
            return;
        }
        this.isDrag = true;

        const drag = this.options.drag;
        drag && drag({
            datas: this.datas,
            clientX,
            clientY,
            deltaX,
            deltaY,
            distX: clientX - this.startX,
            distY: clientY - this.startY,
            inputEvent: e,
        });

        this.prevX = clientX;
        this.prevY = clientY;
    }
    public onDragEnd = (e: any) => {
        if (!this.flag) {
            return;
        }
        this.flag = false;

        const dragend = this.options.dragend;
        dragend && dragend({
            datas: this.datas,
            isDrag: this.isDrag,
            inputEvent: e,
            clientX: this.prevX,
            clientY: this.prevY,
            distX: this.prevX - this.startX,
            distY: this.prevY - this.startY,
        });
    }
    public unset() {
        const el = this.el;
        const container = this.options.container!;

        if (this.isMouse) {
            el.removeEventListener("mousedown", this.onDragStart);
            container.removeEventListener("mousemove", this.onDrag);
            container.removeEventListener("mouseup", this.onDragEnd);
        }
        if (this.isTouch) {
            el.removeEventListener("touchstart", this.onDragStart);
            container.removeEventListener("touchmove", this.onDrag);
            container.removeEventListener("touchend", this.onDragEnd);
        }
    }
}
