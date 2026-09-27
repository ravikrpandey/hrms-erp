import { Component, Inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl,FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-dispatch-list-form-dialog',
  templateUrl: './dispatch-list-form-dialog.component.html',
  styleUrls: ['./dispatch-list-form-dialog.component.scss']
})

export class DispatchListFormDialogComponent {
  create_fglist_Form:FormGroup;
  rowClass: any;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  departmentId: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<DispatchListFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.create_fglist_Form = this.fb.group({
      product_name: new FormControl(null),
      product_code: new FormControl(null),
      product_variant: new FormControl(null),
     })
     this.rowClass = 'rowClass';
  }
  ngOnInit() {
  }

  onSubmitForm() {
    this.confirmDialog();
  }

  confirmDialog() {
    this.dialog.close();
  }

  rowData = [
    {batch_no: 7, block_no: 10, bay_no: 12, rack_no:20  },
    {batch_no: 12, block_no: 20, bay_no: 10, rack_no:7 },
  ]

  public columnDefs = [
    {
      headerName: 'Batch No',
      valueGetter: 'batch_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Block No',
      field: 'block_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Bay No',
      field: 'bay_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Rack No',
      field: 'rack_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
  ]

}
