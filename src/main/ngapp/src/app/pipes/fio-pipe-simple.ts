import { Pipe, PipeTransform } from "@angular/core";
import { Moment } from "moment";

@Pipe({name: 'fioPipeSimple'})
export class FioPipeSimple implements PipeTransform {
    transform(value) {

        if (value) {
            return value.fn + ' ' + value.ln;
        }
        return value;
    }
}
