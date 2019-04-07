/*
Copyright (c) 2019 Daybrush
name: @daybrush/drag
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/drag.git
version: 0.4.0
*/
function setDrag(el, options) {
  var flag = false;
  var startX = 0;
  var startY = 0;
  var prevX = 0;
  var prevY = 0;
  var datas = {};
  var _a = options.container,
      container = _a === void 0 ? el : _a,
      dragstart = options.dragstart,
      drag = options.drag,
      dragend = options.dragend,
      _b = options.events,
      events = _b === void 0 ? ["touch", "mouse"] : _b;
  var isTouch = events.indexOf("touch") > -1;
  var isMouse = events.indexOf("touch") > -1;

  function getPosition(e) {
    return e.touches && e.touches.length ? e.touches[0] : e;
  }

  function onDragStart(e) {
    flag = true;

    var _a = getPosition(e),
        clientX = _a.clientX,
        clientY = _a.clientY;

    startX = clientX;
    startY = clientY;
    prevX = clientX;
    prevY = clientY;
    datas = {};
    (dragstart && dragstart({
      datas: datas,
      inputEvent: e,
      clientX: clientX,
      clientY: clientY
    })) === false && (flag = false);
    flag && e.preventDefault();
  }

  function onDrag(e) {
    if (!flag) {
      return;
    }

    var _a = getPosition(e),
        clientX = _a.clientX,
        clientY = _a.clientY;

    drag && drag({
      datas: datas,
      clientX: clientX,
      clientY: clientY,
      distX: clientX - startX,
      distY: clientY - startY,
      deltaX: clientX - prevX,
      deltaY: clientY - prevY,
      inputEvent: e
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
      datas: datas,
      inputEvent: e,
      clientX: prevX,
      clientY: prevY,
      distX: prevX - startX,
      distY: prevY - startY
    });
  }

  if (isMouse) {
    el.addEventListener("mousedown", onDragStart);
    container.addEventListener("mousemove", onDrag);
    container.addEventListener("mouseup", onDragEnd); // container.addEventListener("mouseleave", onDragEnd);
  }

  if (isTouch) {
    el.addEventListener("touchstart", onDragStart);
    container.addEventListener("touchmove", onDrag);
    container.addEventListener("touchend", onDragEnd);
  }
}

export { setDrag as drag };
