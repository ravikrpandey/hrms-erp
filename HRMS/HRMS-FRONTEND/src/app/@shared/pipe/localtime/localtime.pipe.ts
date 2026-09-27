import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localtime'
})
export class Localtime implements PipeTransform {
  transform(value: Date | string, format: string = 'MMM d, y, hh:mm a'): string {
    const date = new Date(value);
    return date.toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      month: format.includes('MMM') ? 'short' : undefined,
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: format.includes('a')
    });
  }

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

}

@NgModule({
  imports: [CommonModule],
  declarations: [Localtime],
  exports: [CommonModule, Localtime]
})
export class LocaltimePipe { }
