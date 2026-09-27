import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { ProductMasterActionComponent } from 
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProductMasterActionComponent } from '../../product-master/product-master-action/product-master-action.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EmpDocMasterActionComponent } from '../emp-doc-master-action/emp-doc-master-action.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list-sign',
  templateUrl: './employee-list-sign.component.html',
  styleUrls: ['./employee-list-sign.component.scss']
})
export class EmployeeListSignComponent {
  @ViewChild('container') containerRef: ElementRef;


  errorMessage: any;
  id: any;
  product_master_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  segmentData: any = [];
  arr: { status: string; }[];
  productMasterForm: any;
  show: boolean = false;
  certificateName: any;
  certificateNumber: any;
  segment_certificate: any = [];
  certificate_filter: any = [];
  certificateData: any;
  certificateNames: any;
  segmentName: any;
  getCertificate: any;
  segment_ids: any;
  cer_name: any;
  cer_id: any;
  seg_name: any;
  pdfFile: any = '../../../../../../assets/icons/pdfimg.png';

  scrollButton = document.getElementById('scrollButton');
  getById: any;
  edit: string="Add";
  product_id: any;
  getAllData: any;
  errorMsg: any;
  fileDetails2: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,

  }
  fileicon: any;
  emplId: any;
  dcumentId: any;
  dataDocumetBy: any;
  filePath: any;
  loginUser: any;
  // Add a click event listener to the button


  constructor(
    private fb: FormBuilder,
    private elementRef: ElementRef, private renderer: Renderer2,
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router,
    private _empService: EmpRegistrationService,
  ) {
    this.activetRoute.queryParams.subscribe((res: any) => {
      this.product_id=res.id
      if (res.mode) {
        this.edit="Edit"
        setTimeout(() => {
          this.onFactoryButtonClick1()
        }, 200);
      }
      console.log("kjkjk");
      // this._configurationalMasterService.getProductByid(res.id).subscribe((res: any) => {
      //   this.getById = res.data
      //   console.log(this.getById, "getById");
      //   this.segmentType(this.getById.segment_id)
      //   this.productMasterForm.patchValue({
      //     product_master_name: this.getById.product_master_name,
      //     certificate_type: Number(this.getById.certificate_type_number),
      //     // certificate_type: this.getById.certificate_type,
      //     segmentType: this.getById.segment_id,
      //   })
      // },
      //   // (err: any) => {
      //   //   this.toaster.error("somthing wents wrong")
      //   // }
      //   )
    })
    this.rowClass = 'rowClass'
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // browserRefresh = !router.navigated;
      }
    });
    this.productMasterForm = this.fb.group({
      product_master_name: new FormControl('', Validators.required),
      certificate_type: new FormControl('', Validators.required),
      segmentType: new FormControl(null),
      expenseApprovalfile:new FormControl(null)


      //
    });
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

this._configurationalMasterService.setValue.subscribe((id:any)=>{
  console.log(id,'iddd document ');
  this.dcumentId=id;
this.getByIdDocument()

  this.show=true;
})

    console.log(this.segment_certificate, "segment_certificate");
    this.getAllProduct();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.product_master_id = this.id.product_master_id
    })
    this._configurationalMasterService.getAllCertificate().subscribe((res: any) => {
      this.certificateData = res.data
      const segmentMap: any = {}; // Object to store unique segments
      const output: any = [];
      this.certificateData.forEach((item: any) => {
        const { segment_id, segment_name } = item.segment;
        if (!segmentMap[segment_id]) {
          segmentMap[segment_id] = true;
          output.push({ segment_id, segment_name });
        }
      });
      console.log(output);
      this.segment_ids = output
      console.log(this.certificateData, "certificateData");
      const outputData = this.certificateData.map((item: any) => {
        return {
          cer_id: item.certificate_type_id,
          cer_name: item.certificate_type_name,
          segment_id: item.segment.segment_id,
          segmentName: item.segment.segment_name
        };
      });
      console.log(outputData, "outputData");
      this.segment_certificate = outputData
      this.segmentName = this.segment_certificate.segmentName

    })
    this._configurationalMasterService.getAllCertificate().subscribe((res: any) => {
      this.getCertificate = res.data
      console.log(this.getCertificate, "getCertificate");


    })

    this.employeList();

  }

getByIdDocument(){
this._configurationalMasterService.getByEmpSign(this.dcumentId).subscribe((res:any)=>{
  this.dataDocumetBy=res.data;
console.log( this.dataDocumetBy,' this.dataDocumetBy');

  this.productMasterForm.patchValue({
    segmentType:Number(this.dataDocumetBy?.employee_id)

  })
})
}

  public columnDefs: any = [
    {
      headerName: 'S. No',
      field: 'signature_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Employee Name',
      field: 'employee_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Document ',
      field: 'emp_signature',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    
  {
      headerName: 'Action',
      field: 'product_master_name',
      flex: 1,
      minWidth: 150,
      cellRenderer: EmpDocMasterActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },

    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }

  agInit(params: ICellRendererParams): void {

  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.segment_id;
    let val = event.newValue;

    //  --------------- change on cell -------------------


    let sta = event.data;


    // if (val == event.data.status) {
    //   this._configurationalMasterService.updateProductMaster(id1, sta).subscribe(
    //     (res: any) => {

    //       this.toaster.success('Status Updated Successfully')
    //     }, (err: any) => {
    //       // this.toaster.error('Something went wrong please try again', 'Error Message');

    //     });
    // }
  }

  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) { return; }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {

      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }

  onFactoryButtonClick1() {
    this.show = true
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      console.log(element);
      element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }, 500);

  }
  // onFactoryButtonClick() {
  //   this.route.navigate(['master/itticket/configurational-master/product-master'])
  //   this.show = true
  //   setTimeout(() => {
  //     const element = this.elementRef.nativeElement;
  //     console.log(element);
  //     element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  //   }, 500);

  // }
  onFactoryButtonClick(e:any){
    console.log(this.show,'boolena value');
    
    this.show=!this.show;
    if(this.show===true){
      this.dcumentId=null
      this.cleanInput()
      this.filePath=null
    }else if(this.show===false){
      this.dcumentId=null
      this.cleanInput()
      this.filePath=null

    }
  }

  seePreview(path: string, filePath: any) {
    if (!this.filePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Profile Image',
          confirmButtonColor: "#5d6c7c",
          confirmButtonText: 'Ok',
        })
      }
    } else {
      Swal.fire({
        imageUrl: filePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: "#5d6c7c",
        confirmButtonText: 'Ok',
      })
    }
  };
  cleanInput() {
    this.productMasterForm.get('segmentType')?.reset(),
      this.productMasterForm.get('expenseApprovalfile')?.reset()
     
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getAllProduct() {
    this._configurationalMasterService.getAllEmpSign().subscribe((res: any) => {
      this.rowData = res.data.reverse();
    });
  }
  // certificateType(e: any) {
  //   console.log(e.value, "jhjhjhjhj");
  //   console.log(this.certificate_filter, "jhjhjhjhj");

  //   const certificateNameFilter = this.certificate_filter.filter((res: any) => Number(res.cer_id) == e.value)
  //   this.certificateNames = certificateNameFilter
  //   console.log(this.certificateNames, "names");
  //   this.cer_name = this.certificateNames[0].cer_name
  //   this.cer_id = this.certificateNames[0].cer_id
  // }
  segmentType(e: any) {
    console.log(e);
    this.emplId=e
    // console.log(this.segment_certificate);
    // const certificate_filter = this.segment_certificate.filter((res: any) => Number(res.segment_id) == e)
    // console.log(certificate_filter, "check")
    // this.certificate_filter = certificate_filter
    // this.seg_name = certificate_filter[0].segmentName
  }
  addCreate(){
    this.route.navigate(['master/itticket/configurational-master/product-master'])
this.edit="Add"
this.productMasterForm.reset();

  }

  employeList() {
    let entity_id = localStorage.getItem("selectedEntityId");
  this._empService.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
    // 
    // this.rowData = res.data;
    this.getAllData = res.data;
  
  });
}
expenseApprovalFile(fileInput: File[] | any) {
  this.errorMsg = '';
  if (fileInput.target.files && fileInput.target.files[0]) {
    const file = fileInput.target.files[0];
    console.log(file,'file test');
    
    let files =file.name.split('.');
    console.log(files,'filesfiles');
    
    let fileExe = files[files.length - 1].toUpperCase();
    console.log(fileExe,'fileExe');
    
    const reader = new FileReader();
    // const reader = new FileReader();
    if (fileExe === "PDF") {
      this.fileicon= this.pdfFile;
    }
    // const reader = new FileReader();

    const fileSizeInMb = file.size / 1024 ** 2;
    if (fileSizeInMb > 30) {
      this.errorMsg = 'File size should be less than 30MB';
      return;
    }
    reader.onload = (e: any) => {
      this.fileDetails2.filePath = reader.result;
      console.log(e,'eeeee');
      this.filePath=e.target.result
    };
    

    reader.readAsDataURL(file);
    this.fileDetails2.file = file;
  } else {
    this.fileDetails2 = { filePath: '', file: null };
  }
  
  
  let file2 = this.fileDetails2.file.name.split('.');
  
  let fileExe = file2[file2.length - 1].toUpperCase();
  
  if (fileExe === "PDF") {
    this.pdfFile = fileExe;
  }
}
  save() {
   
    let data={
      sign:this.fileDetails2.file
    }
   console.log(this.fileDetails2.file,'this.fileDetails2.file');
   if(this.dcumentId){
    this._configurationalMasterService.updateEmplSign(this.dcumentId,this.fileDetails2.file).subscribe((res:any)=>{
      console.log(res,'update resss');
      this.toaster.success("Employe Sign Updated");
      this.dcumentId=null
       this.show=false;

      this.employeList()
    },
    (err) => {
      this.toaster.error("Something Went to Wrong")
          })
   }else{
    this._configurationalMasterService.createEmpSign(this.emplId,this.fileDetails2.file).subscribe((res:any)=>{
      console.log(res,'res');
      this.toaster.success("Employe Sign Created")
      this.show=false;

      this.employeList()
    },(err) => {
this.toaster.error("Something Went to Wrong")
    }
    )
   }
  
  }

}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100)
  };

  return obj;
}
