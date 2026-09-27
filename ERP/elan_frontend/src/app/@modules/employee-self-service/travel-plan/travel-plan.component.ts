import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-travel-plan',
  templateUrl: './travel-plan.component.html',
  styleUrls: ['./travel-plan.component.scss'],
})
export class TravelPlanComponent {
  mainId: string;
  employees: any[] = [];
  form: FormGroup;

  constructor(
    private empService: EmpRegistrationService,
    private fb: FormBuilder
  ) {
    this.mainId = localStorage.getItem('EmpMainId')!;
    this.getChildEmployee();
    this.form = this.fb.group({
      employee_id: [-1, [Validators.required]],
    });

    this.form.get('employee_id')?.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  getChildEmployee() {
    this.empService.getChildEmployee(this.mainId).subscribe((res: any) => {
      if (res && res.data) {
        this.employees = res.data;
      }
    });
  }

  onBack() {}
}
