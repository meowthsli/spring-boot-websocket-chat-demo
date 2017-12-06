import { Pipe, PipeTransform } from "@angular/core";
import { Moment } from "moment";

@Pipe({name: 'timeformat'})
export class TimeformatPipe implements PipeTransform {
    transform(value:Moment) {
        
        if (value) {
            return value.format('HH:mm')
        }
        return value;
    }
}