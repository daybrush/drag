import { DragOptions } from "./types";

export default function setDrag(el: Element, options: DragOptions) {
    let flag = false;
    let startX = 0;
    let startY = 0;
    let datas = {};

    const { container = el, dragstart, drag, dragend } = options;

    function getPosition(e) {
        return e.touches && e.touches.length ? e.touches[0] : e;
    }

    function onDragStart(e) {
        flag = true;
        const { clientX, clientY } = getPosition(e);

        startX = clientX;
        startY = clientY;
        datas = {};
        ((dragstart && dragstart({ datas })) === false) && (flag = false);

        flag && e.preventDefault();
    }
    function onDrag(e) {
        if (!flag) {
            return;
        }

        const { clientX, clientY } = getPosition(e);

        drag && drag({ deltaX: clientX - startX, deltaY: clientY - startY, datas });
    }
    function onDragEnd() {
        if (!flag) {
            return;
        }
        flag = false;

        dragend && dragend({ datas });
    }

    el.addEventListener("mousedown", onDragStart);
    el.addEventListener("touchstart", onDragStart);
    container.addEventListener("mousemove", onDrag);
    container.addEventListener("touchmove", onDrag);
    container.addEventListener("mouseup", onDragEnd);
    container.addEventListener("mouseleave", onDragEnd);
    container.addEventListener("touchend", onDragEnd);
}
