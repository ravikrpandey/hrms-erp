import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmailSendeComponent } from '../email-sende/email-sende.component'; 
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import {jsPDF}  from 'jspdf'
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-mail-dialog',
  templateUrl: './mail-dialog.component.html',
  styleUrls: ['./mail-dialog.component.scss']
})
export class MailDialogComponent {
  candidate: any;
  singData: any;
  constructor(
    private route: Router,
    private recruitService: RecruitService,
    private toast: ToastrService,
    private _empMasterService: EmpMasterService,
    public dialogs: MatDialog,
    private activatedRoute:ActivatedRoute,
    private _rbackService: RbacMasterService,

    public dialog: MatDialogRef<MailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.candidate = this.data.id
      console.log('gg',this.candidate);
      
  
  }

  ngOnInit(): void {
    console.log(this.route.url);
    const pathSegments = this.route.url.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    console.log(lastSegment);

    this.recruitService.singleCandidateInfoById(this.candidate).subscribe((res:any)=>{
      this.singData = res.data;
    })


  }

  emailSend(e: any) {
    e.stopPropagation();
    const dialogRef = this.dialogs.open(EmailSendeComponent, {
      width: '40%',
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      height: '70%',
      position: { bottom: '10px', right: '10px' },
      panelClass: 'full-screen-modal',
      data: { id: this.candidate },
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
    this.pdfGenerate()
  }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  pdfGenerate() {
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
    const capturePromise = html2canvas(dashboard, { canvas: canvas}, );
    capturePromise.then((canvas:any) => {
      const doc = new jsPDF(pdfWidth > pdfHeight ? 'landscape' : 'portrait', 'px', [pdfWidth, pdfHeight]);
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight,
      );
      doc.save(`${this.singData.condidate_name} Offer-Latter.pdf`);
      this.toast.info('Please Attach Offer Latter with Mail..')
    }).catch((error:any) => {
      console.error("Error capturing dashboard content: ", error);
    });
    this.dialog.close();
  }
}
