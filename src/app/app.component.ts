
import { JsonCompactPipe, mergeObjects } from './jsonlib/json-compact.pipe';
import { Lsm6Data, Lsm6Service, defLsm6Parameter, defLsm6Data, CalcType } from './lsm6.service';

import { Component, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import { OnDestroy } from '@angular/core';
import { Http } from '@angular/http';

import { Subscription } from 'rxjs';
import PouchDB from 'pouchdb';

const TAB_TEXTS: Array<string> = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const IP_ITEMS = [
  { label: 'lsm6' },
  { label: '192.168.0.5' },
  { label: '169.254.123.123' },
];

interface DimmSlider {
  value: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  lsm6Subscription: Subscription;
  wsConected = false;
  msg: Lsm6Data = defLsm6Data;
  tab = 0;
  showDetails = false;
  showConnectionData = false;
  wsUrl = 'lsm6';
  wsState = 'Jetzt Verbinden...';
  tabTexts: Array<string>;
  ipItems;
  sliders: Array<DimmSlider>;
  loaded = false;
  jsonUpload;
  j = {};
  ready = true;
  current_config_tab: number;
  transmitting = false;
  time_left = 5;
  connecting = false;
  connection_failed = false;
  manually_closed = false;
  transmition_failed = false;

  console = console;
  public clacType = CalcType;

  constructor(public lsm6Service: Lsm6Service, private http: Http) {
    this.tabTexts = TAB_TEXTS;
    this.ipItems = IP_ITEMS;
  }

  ngOnInit() {
    this.wsUrl = window.location.hostname;
    this.get_data();
    // this.get_data_from_pouch();
  }
  private get_data_from_pouch() {
    const db = new PouchDB('IP-Adresses');
    const items = db.get('IP_ITEMS').catch().then(doc => {
      this.ipItems = doc['IP_ITEMS'];
      console.log(doc['IP_ITEMS']);
      this.ipItems.forEach(element => {
        console.log(typeof (element) === 'string');
      });
    });
  }
  private add_to_pouch() {

  }
  private set_timer() {
    this.time_left = 5;
    const timerfunciton = setInterval(() => {
      if (this.time_left > 0) {
        this.time_left--;
      } else {
        if ((!this.wsConected && !this.manually_closed) || this.transmitting) {
          this.lsm6Service.closeSocket();
          this.wsState = 'Verbindungsfehler, nochmals versuchen?';
          this.connection_failed = true;
          this.connecting = false;
          this.wsConected = false;
          this.showConnectionData = true;
          if (this.transmitting) {
            this.transmition_failed = true;
          }

        } else {
        }
        clearInterval(timerfunciton);
      }
    }, 1000);
  }

  set_curret_config_tab(new_config_tab: number) {
    if (this.current_config_tab !== undefined) {
      if (this.current_config_tab === new_config_tab) {
        this.showDetails = !this.showDetails;
        if (!this.showDetails) {
          this.current_config_tab = undefined;
        }
      } else {
        this.current_config_tab = new_config_tab;
        if (!this.showDetails) {
          this.showDetails = true;
        }
      }
    } else {
      this.current_config_tab = new_config_tab;
      this.showDetails = true;
    }
  }

  changeTab(i: number) {
    this.tab = i;
  }

  ngOnDestroy() {
    this.lsm6Subscription.unsubscribe();
  }

  connect() {
    this.connection_failed = false;
    this.lsm6Service.connect(this.wsUrl);
    this.connecting = true;
    this.transmition_failed = false;
    this.wsState = 'Verbinden...';
    this.manually_closed = false;

    this.lsm6Subscription = this.lsm6Service.messages.subscribe(
      (message: MessageEvent) => {
        console.log(message.data);
        this.connection_failed = false;
        this.connecting = false;
        this.transmitting = false;
        mergeObjects(this.msg, JSON.parse(message.data));
        this.wsState = 'Verbunden';
        this.showConnectionData = false;
        this.wsConected = true;
      }, () => {
        this.lsm6Service.closeSocket();
        this.wsState = 'Verbindungsfehler, nochmals versuchen?';
        this.connection_failed = true;
        this.connecting = false;
        this.wsConected = false;
        this.lsm6Subscription.unsubscribe();
        if (!this.connection_failed) {
          this.connecting = false;
          this.wsState = 'Verbindung wiederherstellen?';
        }
        this.showConnectionData = true;
        this.wsConected = false;
      });
    this.get_data();
  }

  get_data() {
    this.http.get('assets/config.json')
      .subscribe(data => {
        if (!this.msg) {
          this.msg = data.json();
          this.loaded = true;
        }
      }, error => {
        if (!this.loaded) {
          this.msg = defLsm6Data;
          console.log(error);
          // console.log('config.json konnte nicht geladen werden, verwende standart Werte.\n' + JSON.stringify(DEFAULT_CONF));
          this.loaded = true;
        }
      });
  }

  disconnect() {
    this.lsm6Service.closeSocket();
    this.wsConected = false;
    this.manually_closed = true;
    this.wsState = 'Verbinden';
  }

  sendObjToLSM6() {
    this.transmitting = true;
    this.set_timer();
    if (this.ready) {
      this.ready = false;
      const s = JSON.stringify(this.j);
      this.lsm6Service.send(s);
      this.j = {};
      this.ready = true;
    } else {
      console.log('deadlock');
      console.log(this.ready);
    }

  }

  sendOffset(event) {
    this.msg.lsm.of[this.tab] = Math.round(event * 2.54);
    if (this.wsConected) {
      this.j = this.msg;
      this.sendObjToLSM6();
    }
  }

  downloadJsonFile() {
    const jsonString = JsonCompactPipe.prototype.transform(this.msg);
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
    this.jsonUpload = reader.result;
    this.loaded = true;
    this.msg = JSON.parse(this.jsonUpload);
    console.log(JSON.stringify(this.msg));
  }

  onSelect(msg: Lsm6Data): void {
    this.msg = msg;
  }

  getOverrunTimestemp(): string {
    if (this.msg == null || !this.wsConected) {
      return '';
    }
    if (this.msg.sens.ts[this.tab] === 0) {
      return 'schalten';
    }
    const ots = (this.msg.sens.ts[this.tab] + this.msg.sens.ot[this.tab] - this.msg.tic) / 1000;
    if (ots > 180) {
      return 'schalte ab in ' + (ots / 60).toFixed(0) + ' min';
    } else if (ots > 0) {
      return 'schalte ab in ' + ots.toFixed(0) + ' s';
    }
    return 'schalten';
  }

  updateBit(number, bitPosition, bitValue) {
    console.log(number + '|' + bitPosition + '|' + bitValue);
    const bitValueNormalized = bitValue ? 1 : 0;
// tslint:disable-next-line: no-bitwise
    const clearMask = ~(1 << bitPosition);
// tslint:disable-next-line: no-bitwise
    return (number & clearMask) | (bitValueNormalized << bitPosition);
  }

  getBit(number, bitPosition) {
    console.log(number + '|' + bitPosition);

// tslint:disable-next-line: no-bitwise
    return (number & (1 << bitPosition)) === 0 ? 0 : 1;
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
