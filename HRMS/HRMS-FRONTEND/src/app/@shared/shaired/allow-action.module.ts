import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllowActionDirective } from '../directives/allow-action.directive';



@NgModule({
  declarations: [
    AllowActionDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[
    AllowActionDirective
  ]
})
export class AllowActionModule { }
