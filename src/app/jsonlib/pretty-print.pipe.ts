import { Pipe, PipeTransform } from '@angular/core';
import { JsonCompactPipe } from './json-compact.pipe';

@Pipe({
  name: 'prettyprint'
})
export class PrettyPrintPipe implements PipeTransform {

  public transform(obj: any, spaces = 2): string {
    var html = JsonCompactPipe.prototype.transform(obj);
    console.log(html);
    return html.replace(' ', '&nbsp;').replace('\n', '<br/>');
  }
}
