import { DimmPipe } from './dimm.pipe';
import { Lsm6Data, CalcType } from '../../lsm6.service';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { faCertificate, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb, faCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-dimm-slider',
  templateUrl: './dimm-slider.component.html',
  styleUrls: ['./dimm-slider.component.css']
})
export class DimmSliderComponent implements OnInit {

  @Input() dimmValue: number;
  @Input() channel: number;
  @Input() sceneSlider = true;
  @Input() disabled = false;
  @Output() dimmValueChange = new EventEmitter<number>();
  rangeValue: number;
  public clacType = CalcType;

  faCircle = faCircle;
  faLightbulb = faLightbulb;
  faCertificate = faCertificate;
  faPowerOff = faPowerOff;

  constructor(private calcPipe: DimmPipe) { }

  ngOnInit() { }

  completeValueChange(field: string, value: boolean, disable: boolean) { }

  setDimm(newDimm: number): void {
    this.dimmValue = this.calcPipe.transformBack(newDimm);
    this.dimmValueChange.emit(this.dimmValue);
  }

  toggleActive(): void {
    if (this.sceneSlider) {
      if (this.dimmValue !== 255) {
        this.dimmValue = 255;
      } else {
        this.dimmValue = 254;
      }
    } else {
      if (this.dimmValue === 0) {
        this.dimmValue = 254;
      } else {
        this.dimmValue = 0;
      }
    }
    this.dimmValueChange.emit(this.dimmValue);
  }

  getCBVal(): boolean {
    if (this.sceneSlider) {
      return this.dimmValue !== 255;
    } else {
      return this.dimmValue !== 0;
    }
  }

}
