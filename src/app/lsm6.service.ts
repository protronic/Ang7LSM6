import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observer } from 'rxjs';
import { Observable } from 'rxjs';

export enum CalcType {
  NoCalc = 'NoCalc',
  Linear = 'Linear',
  Arc = 'Arc',
  Minutes = 'Minutes'
}

export interface Lsm6Parameter {
  lsm?: {
    sp: number[],
    sl: number[][],
    si: number[],
    max: number[],
    min: number[],
  };
  sens?: {
    lt: number[],
    ot: number[],
    mo: number[]
  };
  dil?: number;
}

export interface Lsm6Data extends Lsm6Parameter {
  lsm?: {
    dali: number[],
    sp: number[],
    sl: number[][],
    si: number[],
    of: number[],
    oa: number[],
    caof: number[],
    max: number[],
    min: number[],
  };
  sens?: {
    ls: number[],
    lt: number[],
    ot: number[],
    ts: number[],
    mo: number[],
    pot: number[]
  };
  btn?: boolean[];
  sw?: boolean[];
  tmp?: number;
  tic?: number;
  dil?: number;
  err?: number;
}

export const defLsm6Parameter: Lsm6Parameter = {
  lsm: {
    min: [96, 96, 96, 96, 96, 96],
    max: [254, 254, 254, 254, 254, 254],
    si: [0, 1, 2, 3, 4, 5],
    sp: [0, 0, 0, 0, 0, 0],
    sl: [
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255]
    ]
  },
  sens: {
    lt: [0, 0, 0, 0, 0, 0],
    ot: [0, 0, 0, 0, 0, 0],
    mo: [0, 0, 0, 0, 0, 0]
  },
  dil: 0
};

export const defLsm6Data: Lsm6Data = {
  btn: [false, false, false, false, false, false],
  sw: [true, true, true, true, true, true],
  lsm: {
    min: [96, 96, 96, 96, 96, 96],
    max: [254, 254, 254, 254, 254, 254],
    of: [255, 255, 255, 255, 255, 255],
    si: [0, 1, 2, 3, 4, 5],
    dali: [0, 0, 0, 0, 0, 0],
    sp: [0, 0, 0, 0, 0, 0],
    sl: [
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255, 255]
    ],
    caof: [254, 254, 254, 254, 254, 254],
    oa: [1, 1, 1, 1, 1, 1]
  },
  sens: {
    ls: [-1, -1, -1, -1, -1, -1],
    lt: [0, 0, 0, 0, 0, 0],
    ot: [0, 0, 0, 0, 0, 0],
    ts: [0, 0, 0, 0, 0, 0],
    mo: [0, 0, 0, 0, 0, 0],
    pot: [0, 0, 0, 0, 0, 0]
  },
  dil: 0,
  err: 0
};

@Injectable()
export class Lsm6Service {

  observer: Subject<string>;
  public messages: Observable<MessageEvent>;

  public url = 'ws://lsm6:8088/echo';
  socket: WebSocket;
  constructor() {
    this.messages = Observable.create((observer: Observer<MessageEvent>) => {
      this.socket.onmessage = observer.next.bind(observer);
      this.socket.onerror = observer.error.bind(observer);
      this.socket.onclose = observer.complete.bind(observer);
      return this.socket.close.bind(this.socket);
    });

    this.observer = Subject.create({
      next: (data: string) => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(data);
        }
      }
    });

  }

  public connect(host) {
    this.url = 'ws://' + host + ':8088/echo';
    console.log('LSM6_Chat: ' + this.url);
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      this.socket.close();
      console.log('LSM6_mes: ' + this.socket.readyState);
    }
    this.socket = new WebSocket(this.url);
  }
  public closeSocket() {
    this.socket.close();
  }
  public send(message: string): void {
    // If the websocket is not connected then the QueueingSubject will ensure
    // that messages are queued and delivered when the websocket reconnects.
    // A regular Subject can be used to discard messages sent when the websocket
    // is disconnected.
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }
} // end class ChatService
