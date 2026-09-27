import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent {
  customerDocumentForm: any;
  entity_id: any;
  finance_id: any;
  employee_id: any;
  loginUserDetails: any;
  role: any;
  action_type: any;
  customer_id: any;
  arrayDataPush: any = [];
  documents: any;
  new_customer:any;
  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private location: Location,
    private toaster: ToastrService,
    private acctivate: ActivatedRoute,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService,
    private router: Router
  ) {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.finance_id = localStorage.getItem('financial_id');
    this.employee_id = localStorage.getItem('EmpMainId');
    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;

   
  }

  ngOnInit(): void {
    this.acctivate.queryParams.subscribe((params) => {
      this.customer_id = params['id'];
      this.action_type = params['action_type'];
      this.new_customer = params['new_customer'];
      this.setValidation()
      if (this.customer_id) {
        this.getCustomerDocumentsById(this.customer_id);
      }
    });
  }

  setValidation = () => {
    if ( this.new_customer == 'NO' || !this.new_customer) {
      this.customerDocumentForm = this.fb.group({
        // document_name: new FormControl(null, Validators.required),
        document_name: new FormControl(null),
        upload_document: new FormControl(null, Validators.required),
      })
    }else {
      this.customerDocumentForm = this.fb.group({
        document_name: new FormControl(null),
        upload_document: new FormControl(null),
      })
    }
  }

  getCustomerDocumentsById(id: any) {
    this.salesService.getCustomerDocumentsById(id).subscribe((resp: any) => {
      let res=resp.data;
      // document_name alphabetical sort
      res.sort((a: any, b: any) => 
        a.document_name.localeCompare(b.document_name)
      );
      
      res.forEach((doc: any) => {
        let uploaded_documents = {
          document_name: doc.document_name,
          upload_document: doc.upload_document,
          document_id: doc.id,
        };
        this.arrayDataPush.push(uploaded_documents);
      });
    });
  }

  goBack() {
    this.location.back();
  }

  onSubmitForm() {
  
    if (this.arrayDataPush.length < 1 && this.new_customer == 'NO') {
      return this.toaster.error('Please submit atleast one row!')
    }
    ;
    const formData = {
      upload_document: this.arrayDataPush,
      customer_id: this.customer_id,
      document_name: this.customerDocumentForm.value.document_name,
    };

    console.log('Final Form Data:', formData);
    this.salesService.addCustomerDocument(formData, this.customer_id).subscribe(
      (res: any) => {
        if (res) {
          this.toaster.success(res.message);
          this.arrayDataPush=[];
          this.getCustomerDocumentsById(this.customer_id);
          // if (this.action_type) {
          //   this.router.navigate(['/master/sales/customer-details/address'], { queryParams: { id: this.customer_id, action_type: this.action_type,new_customer:this.new_customer } })
          // } else {
          //   this.router.navigate(['/master/sales/customer-details/address'], { queryParams: { id: this.customer_id,new_customer:this.new_customer } });
          // }
        }
      },
      (err: any) => {
        this.toaster.error(err.error.message);
      }
    );
  }

  onChange(evemt: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(evemt, false, true, false);
      if (!isValidExtension) return this.documents = null;
      const formData = new FormData();
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.documents = `uploaded_files/${response?.url}`;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  async addDocument() {
    if (this.customerDocumentForm.invalid) {
      return this.toaster.warning('Please add document!');
    }
  
    let payload = {
      document_name: this.customerDocumentForm.value.document_name,
      upload_document: this.documents
    };
    await this.arrayDataPush.push(payload);
    this.customerDocumentForm.reset({
      document_name: null,
      upload_document: null
    });
   
    this.toaster.success('Document added successfully!');
  }
  

deletData(doc: any, index: number) {
  if(doc?.document_id){
    this.salesService.deleteCustomerDoc(doc?.document_id).subscribe({
      next: () => {
        this.arrayDataPush.splice(index, 1);
        this.toaster.success('Document deleted successfully');
      },
      error: () => {
        this.toaster.error('Delete failed');
      }
    });
  }else{
    this.arrayDataPush.splice(index, 1);
    this.toaster.success('Document deleted successfully');
  }
}

  generateImageUrl() {
    return environment.servralUrl + '/';
  }

}