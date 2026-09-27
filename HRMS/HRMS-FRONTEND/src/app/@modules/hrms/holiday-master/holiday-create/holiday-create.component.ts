import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { holidayServiceService } from 'src/app/@shared/services/service/hrmServices/holiday-service.service ';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';

@Component({
  selector: 'app-holiday-create',
  templateUrl: './holiday-create.component.html',
  styleUrls: ['./holiday-create.component.scss']
})
export class HolidayCreateComponent {
  holidayForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  holidayData: any;
  holidayid: any;
  view: any;
  entity_id: any;
  allemp: any;
  financial_id: string | null;
  regions: any[] = [];
  entityList: any[] = [];
  municipalities: any[] = [];
  entityArr1: any = []
  entityArr2: any = []

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private toast: ToastrService,
    private services: holidayServiceService,
    private entityService: EntityMasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<HolidayCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.holidayForm = this.fb.group({
      Select_Entity: new FormControl(null, [Validators.required]),
      Holiday_name: new FormControl(null, [Validators.required]),
      Date_name: new FormControl(null, [Validators.required]),
    });
    console.log(data, 'this.cellValue');
    this.holidayData = data?.data;
  }

  ngOnInit() {
    this.holidayid = this.data?.id;
    this.view = this.data?.view;
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.get_All_holiday();
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.loginUserID = this.loginUser.employee_id;
    if (this.holidayid) {
      this.get_ById_holiday();
    }
    this.loadRegions();
    this.loadMunicipalities();
    this.getEntityList();
  }

  loadRegions(): void {
    this.services.getAll_Region(this.entity_id).subscribe(
      (res: { data: any[]; }) => {
        this.regions = res.data;
      },
      (error: any) => {
        console.error('Error fetching regions', error);
      }
    );
  }

  // getEntityList(): void {
  //   this.entityService.getAll_active_Entity().subscribe(
  //     (res: { data: any[]; }) => {
  //       this.entityList = res.data;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching regions', error);
  //     }
  //   );
  // }

  filterEntitylist:any
  getEntityList = () => {
    this.entityService.getAll_active_Entity().subscribe((res: any) => {
      console.log(res.data)
      this.entityList = res.data;
      this.filterEntitylist = [...this.entityList]
      this.entityArr1 = this.entityList.map((res: any) => res.entity_name);
      this.entityArr2 = this.entityList
    })
  }

  loadMunicipalities(): void {
    this.services.get_Municipality(this.entity_id).subscribe(
      (res: { data: any[]; }) => {
        this.municipalities = res.data;
      },
      (error: any) => {
        console.error('Error fetching municipalities', error);
      }
    );
  }

  get_ById_holiday() {
    console.log(this.holidayid);
    this.services.get_ById_holiday(this.holidayid).subscribe((res: any) => {
      this.holidayData = res.data;
      console.log(res.data);
  
      if (this.holidayData?.date) {
        const dateParts = this.holidayData.date.split('/');
        const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`); 

        this.holidayForm.patchValue({
          Select_Entity: this.holidayData?.entity_id,
          Holiday_name: this.holidayData?.holiday_name,
          Date_name: formattedDate,   
        });
      } else {
        console.log("Date is not available or invalid");
      }
    });
  }
  
  get_All_holiday() {
    this.services.get_All_holiday(this.entity_id).subscribe((res: any) => {
      this.allemp = res.data;
    });
  }

  onSubmitForm() {
    this.submitted = false;
    if (this.holidayForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.holidayForm.value;
    console.log(val);
    const data = {
      holiday_name: val.Holiday_name,
      date: val.Date_name,
      entity_id: val.Select_Entity,
      financial_year_id: this.financial_id,
    };
    this.services.create_holiday(data).subscribe(
      (res: any) => {
        if (res.message === 'Holiday already Exits!') {
          this.toast.warning('Holiday Already Exits!');
        } else {
          this.toast.success('Holiday Added Successfully');
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err: any) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('Holiday Already Exits!');
        } else {
          this.toast.error('Holiday Already Existing!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.holidayForm.controls).forEach(key => {
        this.holidayForm.controls[key].markAsTouched();
    });
    
    this.submitted = false;

    if (this.holidayForm.invalid) {
        this.toast.error('Required fields should not be empty.', 'Error Occurred!');
        return;
    }

    let val = this.holidayForm.value;

    const payload = {
        entity_id: val.Select_Entity,
        holiday_name: val.Holiday_name,
        date: val.Date_name,
        financial_year_id: this.financial_id 
    };

    this.services.edit_holiday(this.data.id, payload).subscribe(
        (res: any) => {
            if (res.message == "Holiday Already Exits!") {
                this.toast.warning('Holiday Already Exits!');
            } else {
                this.toast.success('Holiday Updated Successfully');
            }
            this.route.navigate(['master/hrms/holiday-master']);
            this.confirmDialog();
            this.reloadCurrentRoute();
        },
        (err: any) => {
            if (err.status == 400) {
                this.toast.error('Something went Wrong!');
            } else if (err.status == 409) {
                this.toast.error('Holiday Already Exits!');
            } else {
                this.toast.error('Error in submission!');
            }
        }
    );
}


  confirmDialog() {
    this.dialog.close(this.holidayForm.value);
  }

  entityFilter(e: any) {
    let filteredVariable = this.entityArr2.filter((item: any) => e.includes(item.entity_name));
    this.entityList = filteredVariable
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
