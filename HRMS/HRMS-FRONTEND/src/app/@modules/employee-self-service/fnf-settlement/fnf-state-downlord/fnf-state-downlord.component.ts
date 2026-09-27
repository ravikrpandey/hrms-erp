import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import { FnfserviceServiceTsService } from 'src/app/@shared/services/fnfservice.service.ts.service';

@Component({
  selector: 'app-fnf-state-downlord',
  templateUrl: './fnf-state-downlord.component.html',
  styleUrls: ['./fnf-state-downlord.component.scss']
})
export class FnfStateDownlordComponent implements OnInit, AfterViewChecked {
  employee_id: string = '';
  fnfData: any = null;
  hasDownloaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fnfService: FnfserviceServiceTsService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.employee_id = this.route.snapshot.queryParamMap.get('employee_id') || '';
    if (this.employee_id) {
      this.fnfService.getFnfFullDataById(this.employee_id).subscribe({
        next: (res: any) => {
          this.fnfData = res?.data || null;
          if (!this.fnfData) {
            this.toastr.warning('No FnF data found.');
          }
        },
        error: () => {
          this.toastr.error('Failed to fetch FnF data.');
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    // Download only once after view updates with data
    if (this.fnfData && !this.hasDownloaded) {
      this.hasDownloaded = true; 
      this.cdr.detectChanges(); // ensure binding is complete
      setTimeout(() => this.downloadPdf(), 500); // wait a moment for rendering
    }
  }

  downloadPdf() {
    const content = document.getElementById('pdf-section');
    if (!content) {
      this.toastr.error('PDF section not found.');
      return;
    }

//   const options = {
//   margin:       [5, 20, 5, 20], // top, right, bottom, left in mm
//   filename:     `FnF_Statement_${this.employee_id}.pdf`,
//   image:        { type: 'jpeg', quality: 0.98 },
//   html2canvas:  { scale: 2 },
//   jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
//   pagebreak:    { mode: ['css', 'legacy'] }
// };

const options = {
  margin: [5, 5, 5, 5], // small margins to save space
  filename: `FnF_Statement_${this.employee_id}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  pagebreak: { mode: [] } // disable auto page breaks
};


    html2pdf().set(options).from(content).save();
  }


}
