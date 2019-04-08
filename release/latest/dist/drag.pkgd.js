/*
Copyright (c) 2019 Daybrush
name: @daybrush/drag
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/drag.git
version: 0.4.2
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.utils = {}));
}(this, function (exports) { 'use strict';

    function setDrag(el, options) {
      var flag = false;
      var startX = 0;
      var startY = 0;
      var prevX = 0;
      var prevY = 0;
      var datas = {};
      var isDrag = false;
      var _a = options.container,
          container = _a === void 0 ? el : _a,
          dragstart = options.dragstart,
          drag = options.drag,
          dragend = options.dragend,
          _b = options.events,
          events = _b === void 0 ? ["touch", "mouse"] : _b;
      var isTouch = events.indexOf("touch") > -1;
      var isMouse = events.indexOf("mouse") > -1;

      function getPosition(e) {
        return e.touches && e.touches.length ? e.touches[0] : e;
      }

      function onDragStart(e) {
        flag = true;
        isDrag = false;

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

        var deltaX = clientX - prevX;
        var deltaY = clientY - prevY;

        if (!deltaX && !deltaY) {
          return;
        }

        isDrag = true;
        drag && drag({
          datas: datas,
          clientX: clientX,
          clientY: clientY,
          deltaX: deltaX,
          deltaY: deltaY,
          distX: clientX - startX,
          distY: clientY - startY,
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
          isDrag: isDrag,
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

    exports.drag = setDrag;

}));
