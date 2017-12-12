import { Pipe, PipeTransform } from "@angular/core";
import { Moment } from "moment";
import { FIO } from "../stomp/app.stomp";

@Pipe({name: 'fioPipeSimple'})
export class FioPipeSimple implements PipeTransform {
    transform(value:FIO) {
        
        if (value) {
            return value.fn + ' ' + value.ln;
        }
        return value;
    }
}