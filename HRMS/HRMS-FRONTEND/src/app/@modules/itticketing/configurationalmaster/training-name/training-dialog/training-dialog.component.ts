import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
@Component({
  selector: 'app-training-dialog',
  templateUrl: './training-dialog.component.html',
  styleUrls: ['./training-dialog.component.scss']
})

export class TrainingDialogComponent {
  [x: string]: any;
  listIndustry: any;
  singleTrainingName: any;
  id:any;
  constructor(private toaster: ToastrService,
    private dialog: MatDialogRef<TrainingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService
  ) {
    
    this.id = data.id
  }
  ngOnInit() {
    this.getByIdTrainingName(this.id);
  }

  getByIdTrainingName(id:any) {
 
  this._configurationalmasterService.getByIdTrainingName(id).subscribe((res: any) => {
    this.singleTrainingName = res.data;
   },
  (err: any) => {
    this.toaster.warning('Please Activate Status of this Record ',
    'Error Message'       
    );
    
  }
);
}
}
