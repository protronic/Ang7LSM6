import {Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges} from '@angular/core';

@Component({
// tslint:disable-next-line: component-selector
  selector: '[app-pro-select]',
  templateUrl: './pro-select.component.html',
  styleUrls: ['./pro-select.component.css']
})
export class ProSelectComponent implements OnInit, OnChanges {

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

  ngOnInit() {
    this.cbValue = this.selection !== this.defaultSelection;
    this.selectDisabled = !this.cbValue;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cbValue = this.selection !== this.defaultSelection;
    this.selectDisabled = !this.cbValue;
  }

  selectionChanged(event): void {
    this.selection = event;
    this.cbValue = this.selection !== this.defaultSelection;
    this.selectDisabled = !this.cbValue;
    let index = this.selectItems.indexOf(this.selection);
    this.flags = index;
    console.log(this.flags & this.flagMask);
    this.flagsChange.emit(this.flags);
    this.selectionChange.emit(this.selection);
  }

  toggleActive(event): void {
    this.cbValue = event.target.checked;
    this.selectDisabled = !this.cbValue;
    if (this.defaultSelection != null) {
      if (!this.cbValue) {
        this.selection = this.defaultSelection;
      }
      this.selectionChange.emit(this.selection);
    }
    this.cbChange.emit(this.cbValue);
  }

}
