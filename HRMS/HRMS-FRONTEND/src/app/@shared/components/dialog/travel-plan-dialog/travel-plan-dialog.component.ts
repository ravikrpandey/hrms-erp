import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, ReplaySubject } from 'rxjs';
import { TravelPlan } from 'src/app/@shared/interface/travel-plan.interface';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-travel-plan-dialog',
  templateUrl: './travel-plan-dialog.component.html',
  styleUrls: ['./travel-plan-dialog.component.scss'],
})
export class TravelPlanDialogComponent {
  constructor(
    private dialog: MatDialogRef<TravelPlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): () => void {
    return () => this.dialog.close(false);
  }

  onDialogClose(event: boolean): void {
    this.dialog.close(event);
  }
}
