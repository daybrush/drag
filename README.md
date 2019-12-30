<p align="middle" ><img src="https://github.com/daybrush/drag/raw/master/demo/images/logo.png" /></p>

<h2 align="middle">Drag</h2>
<p align="middle"><a href="https://www.npmjs.com/package/@daybrush/drag" target="_blank"><img src="https://img.shields.io/npm/v/@daybrush/drag.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a> <img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/> <a href="https://github.com/daybrush/drag/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/drag.svg?style=flat-square&label=license&color=08CE5D"/></a>
</p>

<p align="middle">You can set up drag events in any browser.</p>


* [API Documentation](https://daybrush.com/drag/release/latest/doc/)

## ⚙️ Installation
```sh
$ npm i @daybrush/drag
```

```html
<script src="https://daybrush.com/drag/release/latest/dist/drag.min.js"></script>
```


## 🚀 How to use
```ts
import { drag, DragOptions } from "@daybrush/drag";
// utils.drag

interface DragOptions {
    container?: Window | Node | Element;
    events?: Array<"mouse" | "touch">;
    preventRightClick?: boolean;
    dragstart?: (options: OnDragStart) => any;
    drag?: (options: OnDrag) => any;
    dragend?: (options: OnDragEnd) => any;
    pinchstart?: (options: OnPinchStart) => any;
    pinch?: (options: OnPinch) => any;
    pinchend?: (options: OnPinchEnd) => any;
}

const dragger = drag(document.querySelector(".target"), {
    container: window,
    dragstart: ({ inputEvent }) => {
        inputEvent.stopPropagation();
    },
    drag: ({ distX, distY }) => {
        console.log(distX, distY);
    },
    dragend: ({ isDrag }) => {
        console.log(isDrag);
    },
    pinchstart: ({ touches }) => {

    },
    pinch: ({ touches, scale, clientX, clientY }) => {

    },
    pinchend: ({ touches, clientX, clientY }) => {

    }
});

// remove event
dragger.unset();
```

## 👏 Contributing

If you have any questions or requests or want to contribute to `drag`, please write the [issue](https://github.com/daybrush/drag/issues) or give me a Pull Request freely.

## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/daybrush/drag/issues) on GitHub.


## 📝 License

This project is [MIT](https://github.com/daybrush/drag/blob/master/LICENSE) licensed.

```
MIT License

Copyright (c) 2019 Daybrush

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
