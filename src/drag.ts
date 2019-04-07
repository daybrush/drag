import { DragOptions } from "./types";

export default function setDrag(el: Element, options: DragOptions) {
    let flag = false;
    let startX = 0;
    let startY = 0;
    let datas = {};

    const { container = el, dragstart, drag, dragend, events = ["touch", "mouse"] } = options;
    const isTouch = events.indexOf("touch") > -1;
    const isMouse = events.indexOf("touch") > -1;

    function getPosition(e) {
        return e.touches && e.touches.length ? e.touches[0] : e;
    }

    function onDragStart(e) {
        flag = true;
        const { clientX, clientY } = getPosition(e);

        startX = clientX;
        startY = clientY;
        datas = {};
        ((dragstart && dragstart({ datas, inputEvent: e })) === false) && (flag = false);

        flag && e.preventDefault();
    }
    function onDrag(e) {
        if (!flag) {
            return;
        }

        const { clientX, clientY } = getPosition(e);

        drag && drag({clientX, clientY, deltaX: clientX - startX, deltaY: clientY - startY, datas, inputEvent: e });
    }
    function onDragEnd(e) {
        if (!flag) {
            return;
        }
        flag = false;

        dragend && dragend({ datas, inputEvent: e });
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
