import { Pipe, PipeTransform } from "@angular/core";
import { max } from "moment";

@Pipe({name: 'elipsis'})
export class ElipsisPipe implements PipeTransform {
    transform(text:string, ...args: any[]) {
        if (text) {
            var count = 30;
            if(args && args.length) {
                count = args[0];
            }
            let res = text.slice(0, Math.min(count, text.length));
            if(text.length > count) {
                res = res + '..';
            }
            return res;
        }
        return text;
    }
}