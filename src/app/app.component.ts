import { JsonCompactPipe, mergeObjects } from './jsonlib/json-compact.pipe';
import { Lsm6Data, Lsm6Service } from './lsm6.service';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { Injectable, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { StringifyOptions } from 'querystring';
import { Subscription } from 'rxjs';

const DEFAULT_CONF =
  '{"btn": [false,false,false,false,false,false],\
    "sw": [true,true,true,true,true,true],"tmp": 20, "tic": 0,\
    "lsm": {"dali": [254, 254, 254, 254, 254, 254], "sp": [0, 0, 0, 0, 0, 0], \
        "sl": [[255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255],\
              [255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255], \
              [255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255]]},\
    "sens": {"ls": [0, 0, 0, 0, 0, 0], "lt": [0, 0, 0, 0, 0, 0], "ot": [0, 0, 0, 0, 0, 0],\
    "ts":[0, 0, 0, 0, 0, 0], "mo": [0, 0, 0, 0, 0, 0]}}';
const TAB_TEXTS: Array<string> = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const IP_ITEMS = [
  { label: 'lsm6' },
  { label: '192.168.0.5' },
  { label: '169.254.123.123' },
];

interface DimmSlider {
  value: number;
}

const sliders: Array<DimmSlider> = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  lsm6Subscription: Subscription;
  stateSubscription: Subscription;
  wsConected = false;
  msg: Lsm6Data = null;
  tab = 0;
  showDetails = false;
  showConnectionData = false;
  wsUrl = 'lsm6';
  wsState = 'Jetzt Verbinden...';
  tabTexts: Array<string>;
  ipItems;
  sliders: Array<DimmSlider>;
  loaded = false;
  imageSrc;
  j = {};

  constructor(public lsm6Service: Lsm6Service, private http: Http) {
    this.tabTexts = TAB_TEXTS;
    this.sliders = sliders;
    this.ipItems = IP_ITEMS;
  }

  ngOnInit() {
    this.wsUrl = window.location.hostname;
    this.connect();
  }

  ngOnDestroy() {
    this.lsm6Subscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }

  connect() {


    this.lsm6Service.connect(this.wsUrl);
    this.lsm6Subscription = this.lsm6Service.messages.subscribe(
      (message: MessageEvent) => {
        console.log('sw: ' + this.msg.sw);
        console.log('received message from server: ' + message.data);
        mergeObjects(this.msg, JSON.parse(message.data));
        this.wsState = 'Verbunden';
        this.showConnectionData = false;
        this.wsConected = true;
      }, error => {
        console.log('LSM6 websocket Closed: ' + this.lsm6Service.url);
        this.wsUrl = 'lsm6';
        this.lsm6Subscription.unsubscribe();
        this.wsConected = false;
      }, () => {
        this.lsm6Subscription.unsubscribe();
        this.wsState = 'Verbindung wiederherstellen?';
        console.log('LSM6 websocket Error: ' + this.lsm6Service.url);
        this.wsConected = false;
      });



    try {
      this.http.get('assets/config.json')
        .subscribe(data => {
          if (!this.msg) {
            this.msg = data.json();
            console.log(JSON.stringify(this.msg));
            this.loaded = true;
          }
        });
    } catch (err) {
      if (!this.loaded) {
        this.msg = JSON.parse(DEFAULT_CONF);
        console.log('config.json konnte nicht geladen werden, verwende standart Werte.\n' + JSON.stringify(DEFAULT_CONF));
        this.loaded = true;
      }
    }

  }

  disconnect() {
    this.lsm6Service.closeSocket();
    this.wsConected = false;
  }

  sendObjToLSM6() {
    const s = JSON.stringify(this.j);
    this.lsm6Service.send(s);
    this.j = {};
  }

  downloadJsonFile() {
    const jsonString = JsonCompactPipe.prototype.transform(this.msg);
    console.log(jsonString);
    const file = new Blob([jsonString], { type: 'text/json;charset=utf-8' });
    saveAs(file, 'config.json');
  }

  uploadJsonFile(e) {
    const file: File = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    const pattern = /json/;
    const reader = new FileReader();

    if (!file.name.match(pattern)) {
      alert('invalid format ' + file.name);
      return;
    }

    this.loaded = false;

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsText(file);
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
    this.msg = JSON.parse(this.imageSrc);
    console.log(JSON.stringify(this.msg));
  }

  onSelect(msg: Lsm6Data): void {
    this.msg = msg;
  }

  overrunTimeToMsg(newOt: number): void {
    this.msg.sens.ot[this.tab] = (newOt * 60000);
  }

  ifModeNull(mode: boolean): void {
    this.msg.sens.mo[this.tab] = mode ? 1 : 0;
    if (!mode) {
      this.msg.sens.lt[this.tab] = 0
    }
  }

  getOverrunTimestemp(): string {
    if (this.msg == null || !this.wsConected) {
      return '';
    }
    const ots = (this.msg.sens.ts[this.tab] - this.msg.tic) / 1000;
    if (ots > 180) {
      return 'schalte ab in ' + (ots / 60).toFixed(0) + ' min';
    } else if (ots > 0) {
      return 'schalte ab in ' + ots.toFixed(0) + ' s';
    }
    return 'schalten';
  }

  //  refreshSelect(value: any): void {
  ////    this.wsUrl = value;
  //  }
  //
  //  typedSelect(value: any): void {
  //    console.log(value);
  //    this.itemselectors[2] = value;
  //  }
  //
  //  selectedSelect(value: any): void {
  //    this.wsUrl = value;
  //  }
  //
  //  removedSelect(value: any): void {
  //    console.log('removed: ' + value);
  //  }
}
