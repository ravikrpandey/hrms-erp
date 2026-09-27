import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {MatIconModule} from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-tableactionbutton',
  imports: [MatIconModule,MatTooltipModule, CommonModule, MatButton],
  templateUrl: './tableactionbutton.component.html',
  styleUrl: './tableactionbutton.component.css'
})
export class TableactionbuttonComponent implements ICellRendererAngularComp  {
  params: any;

  constructor(private router: Router) {}

  agInit(params: any): void {
   // debugger
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onEdit() {
    this.params?.onEdit?.(this.params.data);
  }

  onDelete() {
    this.params?.onDelete?.(this.params.data);
  }

  onView() {
    this.params?.onView?.(this.params.data);
  }
  onUpdateStatus(){
    this.params?.onUpdateStatus?.(this.params.data)
  }

   onInitiate() {
    this.params?.onInitiate?.(this.params.data);
  }
  onClickCount(){
    this.params?.onClickCount?.(this.params.data)
  }
  onTaskTaker(){
     this.params?.onTaskTaker?.(this.params.data);
  }
  onShareLink(){
     this.params?.onShareLink?.(this.params.data);
  }
  onCopy(){
    this.params?.onCopy?.(this.params.data);
  }

//   onStart(){
//     this.params?.onStart?.(this.params.data);
//   }

//   // onResume(){
//   //   this.params?.onResume?.(this.params.data);
//   // }

//   onPause() {
//   if (this.params?.onPause) {
//     this.params.onPause(this.params.data); 
//   }
// }

goTolearningPath(courseId: string) {
  this.router.navigate(['/start-course'], { queryParams: { id: courseId } });
}

goToCourse(courseId: string) {
  this.router.navigate(['/assigned_course'], { queryParams: { id: courseId } });
}

goToCommunity(communityId: string, courseId:string) {
  this.router.navigate(['/list-community'], { queryParams: { communityId: communityId, courseId:courseId } });
}


}
