import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDialogueComponent } from './app-dialogue.component';

@NgModule({
  declarations: [
    AppDialogueComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [AppDialogueComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppDialogueModule { }
