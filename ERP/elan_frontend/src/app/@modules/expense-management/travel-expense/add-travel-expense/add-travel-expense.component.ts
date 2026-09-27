import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

/**
 * ================================================================
 * Component Name : AddTravelExpenseComponent
 * File Name      : app-add-travel-expense.ts
 * Module         : Travel & Reimbursement
 * Description    :
 *   - Component for handling Travel Requests from Dashboard.
 *
 * Developed By   : Gyan Prakash
 * Created On     : 05-Sep-2025
 * Last Modified  : 13-Sep-2025
 * Version        : 1.0.0
 * ================================================================
 */
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
      .getTravelRequestOfEmp(entity, financialid)
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
