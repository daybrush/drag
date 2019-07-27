import Dragger from "./Dragger";
import { DragOptions } from "./types";

export default function setDrag(el: Element, options: DragOptions) {
    return new Dragger(el, options);
}
