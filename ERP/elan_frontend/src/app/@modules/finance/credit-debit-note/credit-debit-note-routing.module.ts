import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditDebitListComponent } from './credit-debit-list/credit-debit-list.component';
import { AddCreditDebitNoteComponent } from './add-credit-debit-note/add-credit-debit-note.component';

const routes: Routes = [
  {
    path:'',component:CreditDebitListComponent
  },
  {
    path:'add-credit-debit-note',component:AddCreditDebitNoteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditDebitNoteRoutingModule { }
