import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceDetectionList } from './face-detection-list/face-detection-list';
import { FaceDetectionCapture } from './face-detection-capture/face-detection-capture';
import { EssPaySlipComponent } from '../ess-pay-slip/ess-pay-slip/ess-pay-slip.component';

const routes: Routes = [
  {path:'',component:FaceDetectionCapture},
  {path:'face-detection-list',component:FaceDetectionList},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaceDetectionRoutingModule { }
