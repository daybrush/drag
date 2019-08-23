/*
Copyright (c) 2019 Daybrush
name: @daybrush/drag
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/drag.git
version: 0.8.2
*/
'use strict';

var utils = require('@daybrush/utils');

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

function getPinchDragPosition(clients, prevClients, startClients) {
  var nowCenter = getAverageClient(clients);
  var prevCenter = getAverageClient(prevClients);
  var startCenter = getAverageClient(startClients);
  var pinchClient = getAddClient(startClients[0], getMinusClient(nowCenter, startCenter));
  var pinchPrevClient = getAddClient(startClients[0], getMinusClient(prevCenter, startCenter));
  return getPosition(pinchClient, pinchPrevClient, startClients[0]);
}
function isMultiTouch(e) {
  return e.touches && e.touches.length >= 2;
}
function getPositionEvent(e) {
  if (e.touches) {
    return getClients(e.touches);
  } else {
    return [getClient(e)];
  }
}
function getPosition(client, prevClient, startClient) {
  var clientX = client.clientX,
      clientY = client.clientY;
  var prevX = prevClient.clientX,
      prevY = prevClient.clientY;
  var startX = startClient.clientX,
      startY = startClient.clientY;
  var deltaX = clientX - prevX;
  var deltaY = clientY - prevY;
  var distX = clientX - startX;
  var distY = clientY - startY;
  return {
    clientX: clientX,
    clientY: clientY,
    deltaX: deltaX,
    deltaY: deltaY,
    distX: distX,
    distY: distY
  };
}
function getDist(clients) {
  return Math.sqrt(Math.pow(clients[0].clientX - clients[1].clientX, 2) + Math.pow(clients[0].clientY - clients[1].clientY, 2));
}
function getPositions(clients, prevClients, startClients) {
  return clients.map(function (client, i) {
    return getPosition(client, prevClients[i], startClients[i]);
  });
}
function getClients(touches) {
  var length = Math.min(touches.length, 2);
  var clients = [];

  for (var i = 0; i < length; ++i) {
    clients.push(getClient(touches[i]));
  }

  return clients;
}
function getClient(e) {
  return {
    clientX: e.clientX,
    clientY: e.clientY
  };
}
function getAverageClient(clients) {
  return {
    clientX: (clients[0].clientX + clients[1].clientX) / 2,
    clientY: (clients[0].clientY + clients[1].clientY) / 2
  };
}
function getAddClient(client1, client2) {
  return {
    clientX: client1.clientX + client2.clientX,
    clientY: client1.clientY + client2.clientY
  };
}
function getMinusClient(client1, client2) {
  return {
    clientX: client1.clientX - client2.clientX,
    clientY: client1.clientY - client2.clientY
  };
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
    this.options = {};
    this.flag = false;
    this.pinchFlag = false;
    this.datas = {};
    this.isDrag = false;
    this.isPinch = false;
    this.isMouse = false;
    this.isTouch = false;
    this.prevClients = [];
    this.startClients = [];

    this.onDragStart = function (e) {
      if (!_this.flag && e.cancelable === false) {
        return;
      }

      if (!_this.isDrag && isMultiTouch(e) && !_this.pinchFlag) {
        _this.onPinchStart(e);
      }

      if (_this.flag) {
        return;
      }

      var clients = _this.startClients[0] ? _this.startClients : getPositionEvent(e);
      _this.flag = true;
      _this.isDrag = false;
      _this.startClients = clients;
      _this.prevClients = clients;
      _this.datas = {};
      var position = getPosition(clients[0], _this.prevClients[0], _this.startClients[0]);
      var _a = _this.options,
          dragstart = _a.dragstart,
          preventRightClick = _a.preventRightClick;

      if (preventRightClick && e.which === 3 || (dragstart && dragstart(__assign({
        datas: _this.datas,
        inputEvent: e
      }, position))) === false) {
        _this.flag = false;
      }

      _this.flag && e.preventDefault();
    };

    this.onDrag = function (e) {
      if (!_this.flag) {
        return;
      }

      var clients = getPositionEvent(e);

      if (_this.pinchFlag) {
        _this.onPinch(e, clients);
      }

      var prevClients = _this.prevClients;
      var startClients = _this.startClients;
      var position = _this.pinchFlag ? getPinchDragPosition(clients, prevClients, startClients) : getPosition(clients[0], prevClients[0], startClients[0]);

      if (!position.deltaX && !position.deltaY) {
        return;
      }

      _this.isDrag = true;
      var drag = _this.options.drag;
      drag && drag(__assign({
        datas: _this.datas
      }, position, {
        inputEvent: e
      }));
      _this.prevClients = clients;
    };

    this.onDragEnd = function (e) {
      if (!_this.flag) {
        return;
      }

      if (_this.pinchFlag) {
        _this.onPinchEnd(e);
      }

      _this.flag = false;
      var dragend = _this.options.dragend;
      var prevClients = _this.prevClients;
      var startClients = _this.startClients;
      var position = _this.pinchFlag ? getPinchDragPosition(prevClients, prevClients, startClients) : getPosition(prevClients[0], prevClients[0], startClients[0]);
      _this.startClients = [];
      _this.prevClients = [];
      dragend && dragend(__assign({
        datas: _this.datas,
        isDrag: _this.isDrag,
        inputEvent: e
      }, position));
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
      utils.addEvent(el, "mousedown", this.onDragStart);
      utils.addEvent(container, "mousemove", this.onDrag);
      utils.addEvent(container, "mouseup", this.onDragEnd);
    }

    if (this.isTouch) {
      utils.addEvent(el, "touchstart", this.onDragStart);
      utils.addEvent(container, "touchmove", this.onDrag);
      utils.addEvent(container, "touchend", this.onDragEnd);
    }
  }

  var __proto = Dragger.prototype;

  __proto.isDragging = function () {
    return this.isDrag;
  };

  __proto.isPinching = function () {
    return this.isPinch;
  };

  __proto.onPinchStart = function (e) {
    var _a, _b;

    this.pinchFlag = true;
    var pinchstart = this.options.pinchstart;
    var pinchClients = getClients(e.changedTouches);

    (_a = this.startClients).push.apply(_a, pinchClients);

    (_b = this.prevClients).push.apply(_b, pinchClients);

    if (!pinchstart) {
      return;
    }

    var startClients = this.startClients;
    var startAverageClient = getAverageClient(startClients);
    var centerPosition = getPosition(startAverageClient, startAverageClient, startAverageClient);
    pinchstart(__assign({
      datas: this.datas,
      touches: getPositions(startClients, startClients, startClients)
    }, centerPosition, {
      inputEvent: e
    }));
  };

  __proto.onPinch = function (e, clients) {
    if (!this.flag || !this.pinchFlag) {
      return;
    }

    this.isPinch = true;
    var pinch = this.options.pinch;

    if (!pinch) {
      return;
    }

    var prevClients = this.prevClients;
    var startClients = this.startClients;
    var centerPosition = getPosition(getAverageClient(clients), getAverageClient(prevClients), getAverageClient(startClients));
    var distance = getDist(clients);
    var startDistance = getDist(startClients);
    pinch(__assign({
      datas: this.datas,
      touches: getPositions(clients, prevClients, startClients),
      scale: distance / startDistance,
      distance: distance
    }, centerPosition, {
      inputEvent: e
    }));
  };

  __proto.onPinchEnd = function (e) {
    if (!this.flag || !this.pinchFlag) {
      return;
    }

    var isPinch = this.isPinch;
    this.isPinch = false;
    this.pinchFlag = false;
    var pinchend = this.options.pinchend;

    if (!pinchend) {
      return;
    }

    var prevClients = this.prevClients;
    var startClients = this.startClients;
    var centerPosition = getPosition(getAverageClient(prevClients), getAverageClient(prevClients), getAverageClient(startClients));
    pinchend(__assign({
      datas: this.datas,
      isPinch: isPinch,
      touches: getPositions(prevClients, prevClients, startClients)
    }, centerPosition, {
      inputEvent: e
    }));
    this.isPinch = false;
    this.pinchFlag = false;
  };

  __proto.unset = function () {
    var el = this.el;
    var container = this.options.container;

    if (this.isMouse) {
      utils.removeEvent(el, "mousedown", this.onDragStart);
      utils.removeEvent(container, "mousemove", this.onDrag);
      utils.removeEvent(container, "mouseup", this.onDragEnd);
    }

    if (this.isTouch) {
      utils.removeEvent(el, "touchstart", this.onDragStart);
      utils.removeEvent(container, "touchmove", this.onDrag);
      utils.removeEvent(container, "touchend", this.onDragEnd);
    }
  };

  return Dragger;
}();

function setDrag(el, options) {
  return new Dragger(el, options);
}

Dragger.drag = setDrag;

module.exports = Dragger;
//# sourceMappingURL=drag.cjs.js.map
