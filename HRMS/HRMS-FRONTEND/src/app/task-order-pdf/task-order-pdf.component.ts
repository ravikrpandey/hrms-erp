import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
// import { MyCourseListComponent } from '../@modules/lms/lms-management/management-user/my-courses/my-course-list/my-course-list.component';

@Component({
  selector: 'app-task-order-pdf',
  templateUrl: './task-order-pdf.component.html',
  styleUrls: ['./task-order-pdf.component.scss']
})
export class TaskOrderPdfComponent {
  @ViewChild(TemplateRef) dialogTemplate: TemplateRef<any>;
  Login_user_id: any = localStorage.getItem('signInUser');
  loginUserId: any = JSON.parse(this.Login_user_id).employee_id;
  loginUserName: any = JSON.parse(this.Login_user_id).first_name;
  Certificate_LogoType: any;
  certifies: string;

  constructor(
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
    // if(data.result==100){
    //   this.certifies="has successfully completed the"

    // }
    // else if(data.current_attempt_count==data.Max_attempt_count){
    //   this.certifies="has participated in "

    // }

  }
  pdfGenerate() {
    this.Certificate_LogoType = "complete";
    console.log(this.data, "templateRef");
  
    const dashboard = document.getElementById('dashboard');
  
    if (!dashboard) {
      console.error("Dashboard element not found");
      return;
    }
  
    const pdfWidth = dashboard.offsetWidth;
    const pdfHeight = dashboard.offsetHeight;
  
    const canvas = document.createElement('canvas');
    canvas.width = pdfWidth;
    canvas.height = pdfHeight;
  
    const context = canvas.getContext('2d');
  
    const capturePromise = html2canvas(dashboard, { canvas: canvas });
  
    capturePromise.then((canvas: any) => {
      const doc = new jsPDF(pdfWidth > pdfHeight ? 'landscape' : 'portrait', 'px', [pdfWidth, pdfHeight]);
  
      // Add a header to all pages
      const header = 'This is header';
      const headerHeight = 20;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(header, pdfWidth / 2, headerHeight, { align: 'center' });
  
      // Add a footer to all pages
      const footer = 'This is footer';
      const footerHeight = 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(footer, pdfWidth / 2, pdfHeight - footerHeight, { align: 'center' });
  
      // Add the captured content as an image
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      doc.addImage(imgData, 'JPEG', 2.5, headerHeight + 5, pdfWidth - 5, pdfHeight - headerHeight - footerHeight - 10);
  
      // Save the PDF
      doc.save(`${this.loginUserName} certificate.pdf`);
      this.toast.info('Please Attach Offer Latter with Mail..');
    }).catch((error: any) => {
      console.error("Error capturing dashboard content: ", error);
    });
  }
  
}
