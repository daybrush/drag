import { Client, Position } from "./types";
import { IArrayFormat } from "@daybrush/utils";

export function getPinchDragPosition(
    clients: Client[],
    prevClients: Client[],
    startClients: Client[],
    startPinchClients: Client[],
) {
    const nowCenter = getAverageClient(clients);
    const prevCenter = getAverageClient(prevClients);
    const startCenter = getAverageClient(startPinchClients);
    const pinchClient = getAddClient(startPinchClients[0], getMinusClient(nowCenter, startCenter));
    const pinchPrevClient = getAddClient(startPinchClients[0], getMinusClient(prevCenter, startCenter));

    return getPosition(pinchClient, pinchPrevClient, startClients[0]);
}
export function isMultiTouch(e: any): e is TouchEvent {
    return e.touches && e.touches.length >= 2;
}
export function getPositionEvent(e: any): Client[] {
    if (e.touches) {
        return getClients(e.touches);
    } else {
        return [getClient(e)];
    }
}
export function getPosition(client: Client, prevClient: Client, startClient: Client): Position {
    const { clientX, clientY } = client;
    const {
        clientX: prevX,
        clientY: prevY,
    } = prevClient;

    const {
        clientX: startX,
        clientY: startY,
    } = startClient;
    const deltaX = clientX - prevX;
    const deltaY = clientY - prevY;
    const distX = clientX - startX;
    const distY = clientY - startY;

    return {
        clientX,
        clientY,
        deltaX,
        deltaY,
        distX,
        distY,
    };
}
export function getDist(clients: Client[]) {
    return Math.sqrt(
        Math.pow(clients[0].clientX - clients[1].clientX, 2)
        + Math.pow(clients[0].clientY - clients[1].clientY, 2),
    );
}
export function getPositions(clients: Client[], prevClients: Client[], startClients: Client[]): Position[] {
    return clients.map((client, i) => getPosition(client, prevClients[i], startClients[i]));
}
export function getClients(touches: IArrayFormat<Touch>) {
    const length = Math.min(touches.length, 2);
    const clients = [];

    for (let i = 0; i < length; ++i) {
        clients.push(getClient(touches[i]));
    }
    return clients;
}
export function getClient(e: MouseEvent | Touch): Client {
    return {
        clientX: e.clientX,
        clientY: e.clientY,
    };
}
export function getAverageClient(clients: Client[]) {
    return {
        clientX: (clients[0].clientX + clients[1].clientX) / 2,
        clientY: (clients[0].clientY + clients[1].clientY) / 2,
    };
}
export function getAddClient(client1: Client, client2: Client) {
    return {
        clientX: (client1.clientX + client2.clientX),
        clientY: (client1.clientY + client2.clientY),
    };
}

export function getMinusClient(client1: Client, client2: Client) {
    return {
        clientX: (client1.clientX - client2.clientX),
        clientY: (client1.clientY - client2.clientY),
    };
}
