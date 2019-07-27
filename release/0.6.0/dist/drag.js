/*
Copyright (c) Daybrush
name: @daybrush/drag
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/drag.git
version: 0.6.0
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.utils = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign.apply(this, arguments);
    };

    function getPosition(e) {
      return e.touches && e.touches.length ? e.touches[0] : e;
    }

    var Dragger =
    /*#__PURE__*/
    function () {
      function Dragger(el, options) {
        var _this = this;

        if (options === void 0) {
          options = {};
        }

        this.el = el;
        this.flag = false;
        this.startX = 0;
        this.startY = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.datas = {};
        this.options = {};
        this.isDrag = false;
        this.isMouse = false;
        this.isTouch = false;

        this.onDragStart = function (e) {
          _this.flag = true;
          _this.isDrag = false;

          var _a = getPosition(e),
              clientX = _a.clientX,
              clientY = _a.clientY;

          _this.startX = clientX;
          _this.startY = clientY;
          _this.prevX = clientX;
          _this.prevY = clientY;
          _this.datas = {};
          var _b = _this.options,
              dragstart = _b.dragstart,
              preventRightClick = _b.preventRightClick;

          if (preventRightClick && e.which === 3 || (dragstart && dragstart({
            datas: _this.datas,
            inputEvent: e,
            clientX: clientX,
            clientY: clientY
          })) === false) {
            _this.flag = false;
          }

          _this.flag && e.preventDefault();
        };

        this.onDrag = function (e) {
          if (!_this.flag) {
            return;
          }

          var _a = getPosition(e),
              clientX = _a.clientX,
              clientY = _a.clientY;

          var deltaX = clientX - _this.prevX;
          var deltaY = clientY - _this.prevY;

          if (!deltaX && !deltaY) {
            return;
          }

          _this.isDrag = true;
          var drag = _this.options.drag;
          drag && drag({
            datas: _this.datas,
            clientX: clientX,
            clientY: clientY,
            deltaX: deltaX,
            deltaY: deltaY,
            distX: clientX - _this.startX,
            distY: clientY - _this.startY,
            inputEvent: e
          });
          _this.prevX = clientX;
          _this.prevY = clientY;
        };

        this.onDragEnd = function (e) {
          if (!_this.flag) {
            return;
          }

          _this.flag = false;
          var dragend = _this.options.dragend;
          dragend && dragend({
            datas: _this.datas,
            isDrag: _this.isDrag,
            inputEvent: e,
            clientX: _this.prevX,
            clientY: _this.prevY,
            distX: _this.prevX - _this.startX,
            distY: _this.prevY - _this.startY
          });
        };

        this.options = __assign({
          container: el,
          preventRightClick: true,
          events: ["touch", "mouse"]
        }, options);
        var _a = this.options,
            container = _a.container,
            events = _a.events;
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

      var __proto = Dragger.prototype;

      __proto.isDragging = function () {
        return this.isDrag;
      };

      __proto.unset = function () {
        var el = this.el;
        var container = this.options.container;

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
      };

      return Dragger;
    }();

    function setDrag(el, options) {
      return new Dragger(el, options);
    }

    exports.drag = setDrag;

}));
//# sourceMappingURL=drag.js.map
