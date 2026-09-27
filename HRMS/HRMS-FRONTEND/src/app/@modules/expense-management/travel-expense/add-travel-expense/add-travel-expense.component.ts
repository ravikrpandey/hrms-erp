import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IndirectExpenseDialogueComponent } from './indirect-expense-dialogue/indirect-expense-dialogue.component';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RemarkDilogComponent } from './remark-dilog/remark-dilog.component';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-add-travel-expense',
  templateUrl: './add-travel-expense.component.html',
  styleUrls: ['./add-travel-expense.component.scss'],
})
export class AddTravelExpenseComponent {
 travelId: any;

  typeCheck: any;
  travelexpid: any;
  trData: any[] = [];
  form = new FormGroup({
    travelId: new FormControl(''),
  });
  loginUser: any;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private travelRequest: TravelRequestService,
    private route: Router
  ) {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.typeCheck = res.Type;
      if (res.id) {
        this.travelexpid = res.id;
        this.travelId = res.travelId;
      } else {
        this.typeCheck = 'new_expense';
      }
    });

    this.form.get('travelId')?.valueChanges.subscribe((value) => {
      this.travelId = value;
    });
  }

  ngOnInit(): void {
     let a: any = localStorage.getItem('signInUser');
      this.loginUser = JSON.parse(a);
    this.getTravelRequests();
  }

  onSelectionChange(event: any) {
    console.log(event.value);

    this.travelId = event.value;
  }

  getTravelRequests() {
    const entity = parseInt(
      localStorage.getItem('selectedEntityId')!
    ).toString();
     
    const financialid = parseInt(
      localStorage.getItem('financial_id')!
    ).toString();
    this.travelRequest
      .getTravelRequestOfEmp(entity, financialid,this.loginUser.employee_id)
      .subscribe((res: any) => {
        console.log(res);
        this.trData = res.data;
      });
  }

  close() {
    this.route.navigate([
      '/master/expense-management/travel-expense/travel-expense-list',
    ]);
  }
}
