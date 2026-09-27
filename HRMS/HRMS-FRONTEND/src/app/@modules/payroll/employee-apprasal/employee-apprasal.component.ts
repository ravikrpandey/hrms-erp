import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { TaxSlabService } from 'src/app/@shared/services/service/payroll/tax-slab.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
// import { PaySlipService } from 'src/app/@shared/services/service/payroll/pay-slip.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SalaryProcessService } from 'src/app/@shared/services/payroll/salary-process.service';
import { TaxSlabService } from 'src/app/@shared/services/payroll/tax-slab.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AppraisalFormComponent } from './appraisal-form/appraisal-form.component';

@Component({
  selector: 'app-employee-apprasal',
  templateUrl: './employee-apprasal.component.html',
  styleUrls: ['./employee-apprasal.component.scss']
})
export class EmployeeApprasalComponent{
  
}
