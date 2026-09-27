import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddRegisterCompalinComponent } from './add-register-compalin/add-register-compalin.component';

@Component({
  selector: 'app-register-complain',
  templateUrl: './register-complain.component.html',
  styleUrls: ['./register-complain.component.scss']
})
export class RegisterComplainComponent {
  registercompainForm: FormGroup;
  candidate_id: any;

  constructor(private location: Location,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef) {
    this.registercompainForm = this.fb.group({
      serial_no: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {

  }
  convertToUppercase(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.registercompainForm.get('serial_no')?.setValue(input.value);
  }


  continue() {
    const serialNo = this.registercompainForm.get('serial_no')?.value;
    this.router.navigate(['/master/crm-service/register-complain/addregister-compain'], { queryParams: { serial_no: serialNo } });
  }
}
