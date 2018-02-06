import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from './capitalize';
import { TimeformatPipe } from './time-formatter';
import { ElipsisPipe } from './elipsis';
import { FioPipeSimple } from './fio-pipe-simple';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CapitalizePipe,
    TimeformatPipe,
    ElipsisPipe,
    FioPipeSimple
  ],
  exports: [
    CapitalizePipe,
    TimeformatPipe,
    ElipsisPipe,
    FioPipeSimple
  ]
})
export class PipesModule { }
