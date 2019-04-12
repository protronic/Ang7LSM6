import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dimm'
})
export class DimmPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let percent: number = value;
    if (percent === 255) {
      return '-';
    } else if (percent === 1) {
      return 1;
    }
    percent = percent * 100 / 254;
    return percent.toFixed(0);
  }

}
