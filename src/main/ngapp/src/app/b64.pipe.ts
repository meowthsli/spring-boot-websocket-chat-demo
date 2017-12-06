import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'atob'
})
export class AtobPipe implements PipeTransform {
 transform(value: string, args?: any): string {
   return atob(value);
 }
}

@Pipe({
    name: 'btoa'
 })
 export class BtoaPipe implements PipeTransform {
  transform(value: string, args?: any): string {
    return btoa(value);
  }
 }