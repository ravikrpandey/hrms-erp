import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-maintenance-check-create',
  templateUrl: './maintenance-check-create.component.html',
  styleUrls: ['./maintenance-check-create.component.scss']
})
export class MaintenanceCheckCreateComponent {
  AddNewForm: FormGroup;
  getAllWorkStationData: any;
  entityId:any;
  financial_year_id:any
viewDetails: any;
id: any;
  constructor(
    private _fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
    private route: Router,
  ) {
    this.AddNewForm = _fb.group({
      workstation_id: new FormControl(null, Validators.required),
      entity_id: new FormControl(null),
      financial_year_id: new FormControl(null),

      maintenance_type: new FormArray([
        new FormGroup({
          maintenance: new FormControl(null, [Validators.required]),
        }),
      ]),
    })

  }
  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.activetedRoute.queryParams.subscribe((params: any) => {

    })
  this.getAllActiveWorkStation();
  }


  getAllActiveWorkStation() {
    this._configurationalMasterService.getActiveWorkStationMasterList().subscribe((res: any) => {
      this.getAllWorkStationData = res.data
    })
  }



  goBack() {
    // this.location.back();
  }
  get itemsFormArray(): any {
    return this.AddNewForm.controls;
  }
  addItem() {
    const parameterArray = this.itemsFormArray.maintenance_type as FormArray
    let data = this._fb.group({
      maintenance: new FormControl(null, [Validators.required]),
    });
    parameterArray.push(data);
  }

  removeItem(index: number): void {
    this.itemsFormArray.maintenance_type.removeAt(index);
  }

  ngSubmit() {
    let val = this.AddNewForm.value;
    val.entity_id=this.entityId;
    val.financial_year_id=this.financial_year_id;
     this._configurationalMasterService.create_maintenance_master(val).subscribe((res:any)=>{
        if(res){
          this.toaster.success('Maintenance Check Create Successfully');
          this.route.navigate(['/master/configurational-master/maintenance-check'])
        }
     },(err:any)=>{

     })
  }

}

