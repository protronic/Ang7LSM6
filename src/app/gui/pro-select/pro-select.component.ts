import { Component, Input, SimpleChanges, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[app-pro-select]',
  templateUrl: './pro-select.component.html',
  styleUrls: ['./pro-select.component.css']
})
export class ProSelectComponent implements OnChanges {

  @Input() cbTag: String;
  @Input() selectIcon: String;
  @Input() selectLabel: String;
  @Input() selectItems: any[];
  @Input() selection: any;
  @Input() cbValue: Boolean;
  @Input() defaultSelection: any;
  @Input() id: String;
  @Input() selectDisabled = false;
  @Input() flags: number;
  @Input() flagMask: number;
  @Output() flagsChange = new EventEmitter<number>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() cbChange = new EventEmitter<Boolean>();
  rangeValue: number;

  constructor() { }

  ngOnChanges() {
    if (this.flags !== undefined && this.flagMask !== undefined) {
      this.selection = this.selectItems[0];
      for (let index = this.selectItems.length - 1; index > 0; index--) {
        // tslint:disable-next-line: no-bitwise
        if ((this.flags & this.flagMask[index]) === this.flagMask[index]) {
          this.selection = this.selectItems[index];
          break;
        }
      }
    }
    this.cbValue = this.selection !== this.defaultSelection;
    this.selectDisabled = !this.cbValue;
    console.log('Selection: ' + this.selection + ' Flag: ' + this.flags);
  }

  selectionChanged(event): void {
    this.selection = event;
    this.cbValue = this.selection !== this.defaultSelection;
    this.selectDisabled = !this.cbValue;
    const selectionIndex = this.selectItems.indexOf(this.selection);

    for (let index = this.selectItems.length - 1; index > 0; index--) {
      // tslint:disable-next-line: no-bitwise
      this.flags  = this.flags & ~this.flagMask[index];
    }
    if (this.flags !== undefined && this.flagMask !== undefined) {
      // tslint:disable-next-line: no-bitwise
      this.flags = this.flags | this.flagMask[selectionIndex];
    }
    console.log('Flag: ' + this.flags);
    this.flagsChange.emit(this.flags);
    this.selectionChange.emit(this.selection);
  }

  toggleActive(event): void {
    this.cbValue = event.target.checked;
    this.selectDisabled = !this.cbValue;
    if (this.defaultSelection !== undefined) {
      if (!this.cbValue) {
        this.selection = this.defaultSelection;
      }
      this.selectionChange.emit(this.selection);
    }
    this.cbChange.emit(this.cbValue);
  }

}
