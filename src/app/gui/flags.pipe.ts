import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flags'
})
export class FlagsPipe implements PipeTransform {

  transform(value: number, symbols: string[] = ['1', '1', '1', '1', '1', '1', '1', '1']): string {
    let result = '';
    for (let index = 0; index < symbols.length; index++) {
      const element = symbols[index];
// tslint:disable-next-line: no-bitwise
      result = result.concat(this.test(value, index) ? element : '_' );
    }
    return result;
  }

  test(num: number, bitpos: number): boolean {
    return (num & (1 << bitpos)) !== 0;
  }

}
