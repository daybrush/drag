import { DragOptions } from "./types";

export default function setDrag(el: Element, options: DragOptions) {
    let flag = false;
    let startX = 0;
    let startY = 0;
    let prevX = 0;
    let prevY = 0;
    let datas = {};
    let isDrag = false;

    const { container = el, dragstart, drag, dragend, events = ["touch", "mouse"] } = options;
    const isTouch = events.indexOf("touch") > -1;
    const isMouse = events.indexOf("mouse") > -1;

    function getPosition(e) {
        return e.touches && e.touches.length ? e.touches[0] : e;
    }

    function onDragStart(e) {
        flag = true;
        isDrag = false;
        const { clientX, clientY } = getPosition(e);

        startX = clientX;
        startY = clientY;
        prevX = clientX;
        prevY = clientY;
        datas = {};
        ((dragstart && dragstart({ datas, inputEvent: e, clientX, clientY })) === false) && (flag = false);

        flag && e.preventDefault();
    }
    function onDrag(e) {
        if (!flag) {
            return;
        }

        const { clientX, clientY } = getPosition(e);
        const deltaX = clientX - prevX;
        const deltaY = clientY - prevY;

        if (!deltaX && !deltaY) {
            return;
        }
        isDrag = true;
        drag && drag({
            datas,
            clientX,
            clientY,
            deltaX,
            deltaY,
            distX: clientX - startX,
            distY: clientY - startY,
            inputEvent: e,
        });

        prevX = clientX;
        prevY = clientY;
    }
    function onDragEnd(e) {
        if (!flag) {
            return;
        }
        flag = false;

        dragend && dragend({
            datas,
            isDrag,
            inputEvent: e,
            clientX: prevX,
            clientY: prevY,
            distX: prevX - startX,
            distY: prevY - startY,
        });
    }

    if (isMouse) {
        el.addEventListener("mousedown", onDragStart);
        container.addEventListener("mousemove", onDrag);
        container.addEventListener("mouseup", onDragEnd);
        // container.addEventListener("mouseleave", onDragEnd);
    }
    if (isTouch) {
        el.addEventListener("touchstart", onDragStart);
        container.addEventListener("touchmove", onDrag);
        container.addEventListener("touchend", onDragEnd);
    }
}
