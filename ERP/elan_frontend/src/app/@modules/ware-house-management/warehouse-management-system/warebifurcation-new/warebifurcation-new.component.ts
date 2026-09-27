import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { debounceTime } from 'rxjs';
import { InventoryManagementService } from '../../inventory-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { environment } from 'src/app/environments/environment';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonService } from 'src/app/@shared/services/common.service';


interface Bin {
  binName: string;
  binSize: number;
  occupied: number;
}

interface Shelf {
  shelfName: string;
  // size: number;
  occupied: number;
  expanded: boolean;
  shelfSize: any,
  bins: Bin[];
}

interface Rack {
  rackName: string;
  areaOfRack: any;
  rackOccupiedCapacity: any;
  rackSize: any;
  rackOccupiedSize: any;
  shelves: Shelf[];
}

interface BulkStorage {
  zoneType: string;
  zone: string;
  size: number;
  occupied: number;
  vacant: number;
  attributes: {
    brssCapacity: number;
    fragilityFactor: number;
    temperatureControl: number;
    zone_status: number;
    stackingRules: number;
    productCategoryCompatibility: number;
  };
}
@Component({
  selector: 'app-warebifurcation-new',
  templateUrl: './warebifurcation-new.component.html',
  styleUrls: ['./warebifurcation-new.component.scss']
})
export class WarebifurcationNewComponent {
  warehouseForm: any;
  fileGetCheck: any;
  fileArray: any[] = [];
  checkFile: boolean = false;
  imageToUpload: any;
  imagePath: any;
  fileUpload: any;
  uploadError: any = null;
  indexDetail: any;
  documentView: any;
  id: any;
  getByAllData: any;
  zoneTypeList: any[] = [];
  // warehouseForm!: FormGroup;
  // rackExpanded: boolean[] = [];
  // shelfExpanded: { [rackIndex: number]: boolean[] } = {};
  // binExpanded: { [rackIndex: number]: { [shelfIndex: number]: boolean[] } } = {};
  // zonesCopy = this.fb.array([]);
  // expandedZoneIndex:any=null;
  rackExpanded: boolean[][] = [];
  shelfExpanded: boolean[][][] = [];
  binExpanded: boolean[][][][] = [];
  zoneExpanded: { [zoneIndex: number]: boolean } = {};
  dragData: any;
  selectedZoneType: string = '';
  selectedZoneData: any = null;

  totalArea = 0;
  zoneSize = 0;
  showRacks: boolean = true;
  showBulkStorage: boolean = false;

  rackss: Rack[] = [];
  selectedRackIndex = 0;

  bulk!: BulkStorage;
  zType: any;

  constructor(
    private inventoryService: InventoryManagementService,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private route: Router,
    private activeroute: ActivatedRoute,
    private location: Location,
    private _configurationalMasterService: ConfigurationalmasterService,
    private recruitService: RecruitService,
    private common: CommonService,

  ) {
    this.warehouseForm = this.fb.group({

      // fragility_factor:new FormControl(null),
      // temperature_control:new FormControl(null),
      // status:new FormControl(null),
      // zone_status:new FormControl(null),
      // stacking_rules:new FormControl(null),



    });
    this.warehouseForm = this.fb.group({
      totalArea: ['', Validators.required],
      zoneType: ['', Validators.required],
      dimentions: [''], // shown only if zoneType === 'Rack'
      zone_size: [''],
      bulk_zone_area: [null],
      stack_height: [null],
      fragility_factor: [null],
      temperature_control: [null],
      zone_status: [null],

      product_category_compat: [null],

      locations: [null],
      area: [null],
      capacity: [null],
      racks: this.fb.array([]),

      zonesCopy: this.fb.array([]),

      gst_number: new FormControl(null),
      pan_number: new FormControl(null),
      warehouse_license_number: new FormControl(null),
      pl_provider_name: new FormControl(null),
      contract_start_date: new FormControl(null),
      contract_end_date: new FormControl(null),
      Remark: new FormControl(null),
      employee_photo: new FormControl(null),
      filemaltiple: new FormControl(null),
      zones: this.fb.array([]),

      warehouse_name: new FormControl(null),
      warehouse_code: new FormControl(null),
      warehouse_type: new FormControl(null),
      warehouse_parent: new FormControl(null),
      manager_name: new FormControl(null),
      country_id: new FormControl(null),
      State_id: new FormControl(null),
      city_id: new FormControl(null),
      pin: new FormControl(null),
      address: new FormControl(null),
      warehouse_contact_person: new FormControl(null),
      warehouse_designation: new FormControl(null),
      conatact_number: new FormControl(null),
      email_address: new FormControl(null),
      total_storage_capacity: new FormControl(null),

      brss_id: new FormControl(null),
      brss_type: new FormControl(null),

      weight_limit: new FormControl(null),

      rack_capacity: new FormControl(null),
      selectedType: new FormControl(null)
    });




  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((res: any) => {
      this.id = res.id;
    })
    this.addZone();
    this.getAllCategory()
    this.addZoneCopy()
    this.getByWarehouseBifurcation(this.id);
    this.getZoneTypes();

    this.warehouseForm.get('zoneType')?.valueChanges.subscribe((value: any) => {
      if (value !== 'Rack') {
        this.clearFormArray(this.racks);
        this.warehouseForm.get('dimentions')?.reset();
      }
    });

    this.dragDrop()
    this.fetchLayoutFromBackend();
  }

  getByWarehouseBifurcation(id: any) {
    this.inventoryService.getWarehouseByidNew(id).subscribe((res: any) => {
      const data = res.data;

      // basic warehouse fields
      this.warehouseForm.patchValue({
        warehouse_name: data.name,
        warehouse_code: data.code,
        locations: data.location,
        area: data.area
      });

      // 🔥 MAIN FIX
      this.patchZonesFromApi(data.zone_data);
    });
  }


  patchZonesFromApi(zoneData: any[]) {

    this.zonesCopy.clear();
    this.rackExpanded = [];
    this.shelfExpanded = [];
    this.binExpanded = [];
    this.zoneExpanded = {};

    zoneData.forEach((zone, zoneIndex) => {

      /* ---------------- ZONE ---------------- */
      const zoneGroup = this.fb.group({
        zoneType: zone.zoneType,
        zone_name: zone.zone_name,
        zone_size: zone.zone_size,
        bulk_zone_area: zone.bulk_zone_area,
        numberOfRacks: zone.numberOfRacks,
        bulk_item_category: [zone.bulk_item_category || []],
        bulk_zone_status: [zone.bulk_zone_status || null],
        racks: this.fb.array([]),

      });

      this.zonesCopy.push(zoneGroup);
      this.zoneExpanded[zoneIndex] = true;

      const racksFA = zoneGroup.get('racks') as FormArray;
      this.rackExpanded[zoneIndex] = [];
      this.shelfExpanded[zoneIndex] = [];
      this.binExpanded[zoneIndex] = [];

      /* ---------------- RACK ---------------- */
      zone.racks?.forEach((rack: any, rackIndex: number) => {

        const rackGroup = this.fb.group({
          rackName: [rack.rackName],              // ✅ FIX
          rack_capacity: [rack.rack_capacity],
          numberOfShelves: [rack.numberOfShelves],
          rack_item_category: [rack.rack_item_category || []],
          shelves: this.fb.array([])
        });

        racksFA.push(rackGroup);
        this.rackExpanded[zoneIndex][rackIndex] = true;
        this.shelfExpanded[zoneIndex][rackIndex] = [];
        this.binExpanded[zoneIndex][rackIndex] = [];

        const shelvesFA = rackGroup.get('shelves') as FormArray;

        /* ---------------- SHELF ---------------- */
        rack.shelves?.forEach((shelf: any, shelfIndex: number) => {

          const shelfGroup = this.fb.group({
            shelfName: [shelf.shelfName],          // ✅ FIX
            shelf_capacity: [shelf.shelf_capacity],
            numberOfBins: [shelf.numberOfBins],
            shelf_item_category: [shelf.shelf_item_category || []],
            bins: this.fb.array([])
          });

          shelvesFA.push(shelfGroup);
          this.shelfExpanded[zoneIndex][rackIndex][shelfIndex] = true;
          this.binExpanded[zoneIndex][rackIndex][shelfIndex] = [];

          const binsFA = shelfGroup.get('bins') as FormArray;

          /* ---------------- BIN ---------------- */
          shelf.bins?.forEach((bin: any, binIndex: number) => {

            const binGroup = this.fb.group({
              binName: [bin.binName],               // ✅ FIX
              bin_capacity: [bin.bin_capacity],
              bin_item_category: [bin.bin_item_category || []]
            });

            binsFA.push(binGroup);
            this.binExpanded[zoneIndex][rackIndex][shelfIndex][binIndex] = true;
          });
        });
      });
    });
  }



  get zones(): FormArray {
    return this.warehouseForm.get('zones') as FormArray;
  }
  createZoneGroup(id: number): FormGroup {
    return this.fb.group({
      zone_id: [{ value: id, disabled: false }],
      zoneType_id: ['', Validators.required],
      zone_size: ['', Validators.required]
    });
  }
  addZone(): void {
    const id = this.zones.length + 1;
    this.zones.push(this.createZoneGroup(id));
    console.log(this.zones, 'zones')
  }


  removeZone(index: number): void {

    console.log(this.zones, 'zons')
    this.zonesCopy.removeAt(index);
  }
  goBack() {
    this.location.back();
  }
  employee_photo: any;
  uploadDoc(event: any) {
    // try {
    //   let isValidExtension = this.$common.checkForValidFile(event);
    //   if (!isValidExtension) {
    //     this.basicForm.patchValue({ employee_photo: null });
    //     return this.employee_photo = ""
    //   }
    //   const formData = new FormData();
    //   if (event.target.files && event.target.files[0]) {
    //     formData.append('file', event.target.files[0]);
    //   }
    //   this.$miscellaneousService.documents(formData).subscribe((response: any) => {
    //     if (response) {
    //       this.employee_photo = `uploaded_files/${response?.url}`;
    //     }
    //   }, err => {
    //     console.log(err);
    //   })
    // } catch (error) {
    //   console.log(error);
    // }
  }
  // }
  createZone(): FormGroup {
    return this.fb.group({
      zoneType: ['', Validators.required],
      zone_size: ['', Validators.required],
      dimentions: [null], // optional, only for Rack zones
      racks: this.fb.array([]), // important to initialize racks FormArray here!
    });
  }

  addFileInput(index: number) {
    // console.log(this.fileArray, 'this.fileArray');
    // console.log(this.fileGetCheck, 'this.fileGetCheck');
    if (this.fileGetCheck !== undefined) {
      this.fileArray.splice(index + 1, 0, { imagePath: null, documents: null });
      this.fileGetCheck = undefined;
    } else {
      this.toast.warning("First Upload The File.");

    }
  }

  removeFileInput(index: number) {
    if (this.fileArray.length > 1) {
      this.fileArray.splice(index, 1);
    } else {
      this.toast.warning("At least one file input must be present.");
    }
  }

  sevralUrl() {
    return environment.servralUrl + '/uploaded_files/';
  }
  openFileInNewTab(url: string) {
    window.open(this.sevralUrl() + url, '_blank');
  }
  onChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;

      if (fileType.startsWith('image/') || fileType === 'application/pdf' ||
        fileType === 'application/msword' ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const reader = new FileReader();
        reader.onload = (e: any) => {

          let imagePath = file.type === 'application/pdf' ? "/assets/icons/pdfimg.png" : e.target.result;
          if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
            imagePath = "/assets/icons/docimg.png"
          }
          this.fileArray[index].imagePath = imagePath;
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        this.fileGetCheck = formData;
        formData.append('file', file);

        this.recruitService.uploaddocumentsUpdate(formData).subscribe((res: any) => {
          this.toast.success("File Uploaded Successfully");
          this.fileArray[index].documents = res?.url;
        }, (err: any) => {
          this.toast.error(`${err?.error?.message}`);
        });
      } else {
        this.toast.error('Invalid file format. Please upload an image or PDF.');
        event.target.value = null;
        this.fileArray[index].imagePath = '';
      }
    }
  }
  generateImageUrlEdit() {
    return environment.servralUrl + '/uploaded_files' + '/'
  }
  onChangeEdit(e: any) {
    const input = e.target as HTMLInputElement;
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
    let nameFile = this.imageToUpload?.name;
    let parts = nameFile.split('.');

    let extension = parts[parts?.length - 1];

    const validTypes = ['pdf', 'jpeg', 'png', 'gif', 'docx', 'doc'];
    this.uploadError = null;

    if (!validTypes.includes(extension)) {
      this.uploadError = 'Please upload a valid PDF or image file (JPEG, PNG, GIF).';
      input.value = ''; // Clear the input
    } else {
      this.uploadError = null;
    }

    if (this.uploadError) {
      this.toast.error('Invalid file format. Please upload an image or PDF.');
      e.target.value = null;
      return;
      // this.fileArray[index].imagePath = '';
    }

    let formData = new FormData();

    formData.append('file', this.imageToUpload);

    this.recruitService.uploaddocumentsUpdate(formData).subscribe((res: any) => {
      console.log(res, 'reessss');
      this.fileUpload = res?.url;
      const newFileView = [];
      const parts = res?.url?.split('.');

      const fileNameWithoutExtension = parts.slice(0, -1).join('.');

      newFileView.push({ img_name: fileNameWithoutExtension, uploade_image: res?.url });
      // const index = this.indexDetail;
      // if (index >= 0 && index < this.fileView.length) {

      //     this.fileView.splice(index, 1);
      // }

      // this.fileView.splice(index, 0, newFileView[0]);
      this.imageToUpload = null; // Clear the uploaded file reference
      e.target.value = '';
      this.checkFile = false;
      // console.log(this.fileView, 'updated this.fileView')
    })
    console.log(this.imageToUpload, 'this.imageToUpload remove');

  }

  submitdata() {

    let val = this.warehouseForm.value;
    const zonesArray = this.warehouseForm.get('zones') as FormArray;

    // Getting the value of the FormArray
    const zonesValues = zonesArray.value;

    console.log(zonesValues);
    let data = {
      warehouse_id: this.id,
      total_storage_capacity: val?.total_storage_capacity || "234",
      brss_id: val?.brss_id || "1",
      qty_to_shelf: val?.area_of_shlf || "5",
      qty_of_section: "6",
      prod_cat_compatibility: val?.bulk_zone_area || "true",
      stack_height: val?.stack_height || "234",
      area_shelf: val?.area_of_shlf || "560",
      capacity: val?.capacity || "362",
      fragility_factor: val?.fragility_factor || "testing",
      temperature_control: val?.temperature_control || "true",
      zone_status: val?.zone_status || "233043034",
      stacking_rules: val?.stacking_rules || "testing",
      provider_name_3pl: val?.pl_provider_name || "this Testing",
      contract_start_date: val?.contract_start_date || "2025-07-10",
      contract_end_date: val?.contract_end_date || "2025-07-12",
      sla_document: "uploads/testing.jpg",
      remark: val?.Remark || "testingggg",

      zone_data: val?.zones
    }
    this.inventoryService.createWarehousebifurcation(data).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.router.navigate(['master/warehouse-management/warehouse-bifurcation']);
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  getZoneTypes() {
    this._configurationalMasterService.zoneTypeList().subscribe(
      (res: any) => {
        this.zoneTypeList = res.data;
        console.log("Zone Types:", this.zoneTypeList);
      },
      (err) => {
        this.toast.error("Unable to load zone types");
      }
    );
  }


  redirectToList() {
    // this.route.navigate(['master/hrms/employee-master/employ'])
  }

  // new start

  // addZoneCopy() {
  //   const zoneGroup = this.fb.group({
  //     zoneType: ['Rack'],  // default value
  //     zoneSize: [''],
  //     racks: this.fb.array([]),  // used if zoneType = Rack
  //     bulkStorage: this.fb.array([])  // used if zoneType = Bulk Storage
  //   });

  //   this.zones.push(zoneGroup);
  //   this.expandedZoneIndex = this.zones.length - 1; // open new zone by default
  // }
  // toggleZone(index: number) {
  //   if(this.expandedZoneIndex === index) {
  //     this.expandedZoneIndex = null; // close if clicked again
  //   } else {
  //     this.expandedZoneIndex = index;
  //   }
  // }
  get zonesCopy() {
    return this.warehouseForm.get('zonesCopy') as FormArray;
  }
  addZoneCopy() {
    const zoneGroup = this.fb.group({
      zoneType: [null],
      zone_name: [null],
      zone_size: [null],
      // dimentions: [null],
      bulk_zone_area: [null],
      // bulk_stack_height:[null],

      bulk_item_category: [[]],     // ✅ must be array
      bulk_zone_status: [null],
      zone_status: [null],
      // bulk_item_category: [null],

      numberOfRacks: [null],
      // lifo_fifo:[null],
      // bulk_zone_status: [null],
      product_category_compat: [null],
      racks: this.fb.array([])
    });

    this.zonesCopy.push(zoneGroup);
    this.rackExpanded.push([]); // Maintain rack expansion UI
    this.shelfExpanded.push([]);
    this.binExpanded.push([]);
  }
  getZones() {
    return this.zones;
  }
  getRacks(zoneIndex: number) {
    return this.zonesCopy.at(zoneIndex).get('racks') as FormArray;
  }

  getBulkStorage(zoneIndex: number) {
    return this.zonesCopy.at(zoneIndex).get('bulkStorage') as FormArray;
  }
  toggleRack(zoneIndex: number, rackIndex: number) {
    // Initialize array for the zone if it doesn't exist
    if (!this.rackExpanded[zoneIndex]) {
      this.rackExpanded[zoneIndex] = [];
    }

    // Toggle the specific rack's expansion state
    this.rackExpanded[zoneIndex][rackIndex] = !this.rackExpanded[zoneIndex][rackIndex];
  }

  toggleShelf(zoneIndex: number, rackIndex: number, shelfIndex: number) {
    if (!this.shelfExpanded[zoneIndex]) {
      this.shelfExpanded[zoneIndex] = [];
    }
    if (!this.shelfExpanded[zoneIndex][rackIndex]) {
      this.shelfExpanded[zoneIndex][rackIndex] = [];
    }
    this.shelfExpanded[zoneIndex][rackIndex][shelfIndex] =
      !this.shelfExpanded[zoneIndex][rackIndex][shelfIndex];
  }

  toggleBin(zoneIndex: number, rackIndex: number, shelfIndex: number, binIndex: number) {
    if (!this.binExpanded[zoneIndex]) {
      this.binExpanded[zoneIndex] = [];
    }
    if (!this.binExpanded[zoneIndex][rackIndex]) {
      this.binExpanded[zoneIndex][rackIndex] = [];
    }
    if (!this.binExpanded[zoneIndex][rackIndex][shelfIndex]) {
      this.binExpanded[zoneIndex][rackIndex][shelfIndex] = [];
    }

    this.binExpanded[zoneIndex][rackIndex][shelfIndex][binIndex] =
      !this.binExpanded[zoneIndex][rackIndex][shelfIndex][binIndex];
  }

  get racks(): FormArray {
    return this.warehouseForm.get('racks') as FormArray;
  }
  getShelves(zoneIndex: number, rackIndex: number): FormArray {
    const racks = this.getRacks(zoneIndex);
    const rackGroup = racks?.at(rackIndex);
    return rackGroup?.get('shelves') as FormArray;
  }
  // Clear FormArray helper
  clearFormArray(formArray: FormArray) {
    while (formArray?.length !== 0) {
      formArray?.removeAt(0);
    }
  }

  // Called after entering number of racks and clicking Save
  createRacks(zoneIndex: number) {
    const zone: any = this.zonesCopy.at(zoneIndex);

    if (!zone) return;

    const dimentions = zone.get('numberOfRacks')?.value || 0;

    const racksArray: any = this.fb.array([]);

    for (let i = 0; i < dimentions; i++) {
      racksArray.push(this.fb.group({
        rackName: [''],
        // rackOfVolume: [''],
        numberOfShelves: [''],
        rack_capacity: [''],
        rack_item_category: [''],
        shelves: this.fb.array([])
      }));
    }

    // Set the FormArray in the zone
    zone.setControl('racks', racksArray);

    // Expand tracking initialization
    this.rackExpanded[zoneIndex] = Array(dimentions).fill(false);
    this.shelfExpanded[zoneIndex] = Array(dimentions).fill([]);
    this.binExpanded[zoneIndex] = Array(dimentions).fill([]);
  }


  // getShelves(rackIndex: number): FormArray {
  //   return this.racks.at(rackIndex).get('shelves') as FormArray;
  // }

  // Called after entering number of shelves and clicking Save inside a rack
  createShelves(zoneIndex: number, rackIndex: number) {
    const racks = this.getRacks(zoneIndex);
    const rackGroup = racks?.at(rackIndex);

    if (!rackGroup) return;

    const numShelves = +rackGroup.get('numberOfShelves')?.value || 0;
    const shelvesArray = this.getShelves(zoneIndex, rackIndex);

    // Clear existing shelves
    this.clearFormArray(shelvesArray);

    for (let i = 0; i < numShelves; i++) {
      shelvesArray.push(this.fb.group({
        shelfName: [''],
        // shelfVolume: [''],
        shelf_capacity: [''],
        numberOfBins: [''],
        shelf_item_category: [''],
        bins: this.fb.array([])
      }));
    }

    // Init shelf and bin expand state tracking
    if (!this.shelfExpanded[zoneIndex]) {
      this.shelfExpanded[zoneIndex] = [];
    }
    this.shelfExpanded[zoneIndex][rackIndex] = Array(numShelves).fill(false);

    if (!this.binExpanded[zoneIndex]) {
      this.binExpanded[zoneIndex] = [];
    }
    this.binExpanded[zoneIndex][rackIndex] = Array(numShelves).fill([]);
  }


  getBins(zoneIndex: number, rackIndex: number, shelfIndex: number): FormArray {
    const shelves = this.getShelves(zoneIndex, rackIndex);
    const shelfGroup = shelves?.at(shelfIndex);
    return shelfGroup?.get('bins') as FormArray;
  }


  // Called after entering number of bins and clicking Save inside a shelf
  createBins(zoneIndex: number, rackIndex: number, shelfIndex: number) {
    const shelves = this.getShelves(zoneIndex, rackIndex);
    const shelfGroup = shelves?.at(shelfIndex);

    if (!shelfGroup) return;

    const numBins = +shelfGroup.get('numberOfBins')?.value || 0;
    const binsArray = this.getBins(zoneIndex, rackIndex, shelfIndex);

    this.clearFormArray(binsArray);

    for (let i = 0; i < numBins; i++) {
      binsArray.push(this.fb.group({
        binName: ['', Validators.required],
        // binVolume: ['', Validators.required],
        bin_capacity: [''],
        bin_item_category: ['']
      }));
    }

    // Initialize bin expansion state
    if (!this.binExpanded[zoneIndex]) {
      this.binExpanded[zoneIndex] = [];
    }
    if (!this.binExpanded[zoneIndex][rackIndex]) {
      this.binExpanded[zoneIndex][rackIndex] = [];
    }
    this.binExpanded[zoneIndex][rackIndex][shelfIndex] = Array(numBins).fill(false);
  }
  toggleZone(zoneIndex: number): void {
    this.zoneExpanded[zoneIndex] = !this.zoneExpanded[zoneIndex];
  }

  onSubmit() {

    let val = this.warehouseForm.value
    // let parentVal= this.warehouseForm.value;

    // if(this.warehouseForm.valid) {
    console.log(this.warehouseForm.value);

    let data = {
      warehouse_id: this.id,
      totalArea: val?.totalArea,

      zone_data: val.zonesCopy,
      warehouse_name: val?.warehouse_name || "ABC",
      //  total_storage_capacity:parentVal?.total_storage_capacity || "2",
      //  brss_id:val?.brss_id || "3",
      //  brss_type: val?.brss_type || "1",
      //  stack_height: val?.stack_height || "3",
      weight_limit: val?.weight_limit || "2",
      capacity: val?.capacity || "100",
      stacking_rules: val?.stacking_rules || "20",
    }

    console.log(data, 'data');

    this.inventoryService.createWarehousebifurcation(data).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.router.navigate(['master/warehouse-management/warehouse-bifurcation']);
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
    // } else {
    //   alert('Please fill all required fields');
    // }
  }

  dragDrop() {
    this.dragData = {
      totalArea: "3000",
      warehouse_id: 2,
      zone_data: [
        {
          zoneType: "Rack",
          zone_size: "2000",
          dimentions: 2,
          bulk_zone_area: null,
          stack_height: null,
          fragility_factor: null,
          temperature_control: null,
          zone_status: null,
          stacking_rules: null,
          product_category_compat: null,
          racks: [
            {
              rackName: "R1",
              areaOfRack: "1000",
              numberOfShelves: 2,
              rackSize: 1000,
              rackCapacity: 100,              // capacity in units (static)
              rackOccupiedCapacity: 40,       // example occupied
              rackVacantCapacity: 60,
              rackOccupiedSize: 400,          // area-wise occupation
              rackVacantSize: 600,
              shelves: [
                {
                  shelfName: "S1",
                  shelfSize: "100",
                  numberOfBins: 1,
                  shelfCapacity: 20,
                  shelfOccupiedCapacity: 10,
                  shelfVacantCapacity: 10,
                  shelfOccupiedSize: 50,
                  shelfVacantSize: 50,
                  bins: [
                    {
                      binName: "B1",
                      binSize: "1",
                      binCapacity: 10,
                      binOccupiedCapacity: 10,
                      binVacantCapacity: 6,
                      binOccupiedSize: 5,
                      binVacantSize: 0.6
                    }
                  ]
                },
                {
                  shelfName: "S2",
                  shelfSize: "100",
                  numberOfBins: 2,
                  shelfCapacity: 30,
                  shelfOccupiedCapacity: 10,
                  shelfVacantCapacity: 20,
                  shelfOccupiedSize: 40,
                  shelfVacantSize: 60,
                  bins: [
                    {
                      binName: "B3",
                      binSize: "1",
                      binCapacity: 15,
                      binOccupiedCapacity: 5,
                      binVacantCapacity: 10,
                      binOccupiedSize: 0.5,
                      binVacantSize: 0.5
                    },
                    {
                      binName: "B4",
                      binSize: "1",
                      binCapacity: 15,
                      binOccupiedCapacity: 5,
                      binVacantCapacity: 10,
                      binOccupiedSize: 0.5,
                      binVacantSize: 0.5
                    }
                  ]
                }
              ]
            },
            {
              rackName: "R2",
              areaOfRack: "500",
              numberOfShelves: 1,
              rackSize: 500,
              rackCapacity: 50,
              rackOccupiedCapacity: 10,
              rackVacantCapacity: 40,
              rackOccupiedSize: 100,
              rackVacantSize: 400,
              shelves: [
                {
                  shelfName: "S8",
                  shelfSize: "100",
                  numberOfBins: 1,
                  shelfCapacity: 20,
                  shelfOccupiedCapacity: 10,
                  shelfVacantCapacity: 10,
                  shelfOccupiedSize: 50,
                  shelfVacantSize: 50,
                  bins: [
                    {
                      binName: "B9",
                      binSize: "1",
                      binCapacity: 20,
                      binOccupiedCapacity: 10,
                      binVacantCapacity: 10,
                      binOccupiedSize: 0.5,
                      binVacantSize: 0.5
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          zoneType: "Bulk Storage",
          zone_size: "800",
          dimentions: null,
          bulk_zone_area: null,
          stack_height: "2",
          fragility_factor: "3",
          temperature_control: "1",
          zone_status: "3",
          stacking_rules: "2",
          product_category_compat: "2",
          racks: [],
          bulkCapacity: 200,
          bulkOccupiedCapacity: 80,
          bulkVacantCapacity: 120,
          bulkOccupiedSize: 320,
          bulkVacantSize: 480
        }
      ]
    }

  }


  // totalAreaPx = 900;

  //   getZoneHeight(zoneSize: string): number {
  //     return (parseFloat(zoneSize) / parseFloat(this.dragData.totalArea)) * this.totalAreaPx;
  //   }

  //   getRackHeight(rackSize: string, zoneSize: string): number {
  //     return (parseFloat(rackSize) / parseFloat(zoneSize)) * this.getZoneHeight(zoneSize);
  //   }

  //   getShelfHeight(shelfSize: number, rackArea: number): number {
  //     return Math.max(60, shelfSize * rackArea * 0.5);
  //   }

  //   getBinWidth(binSize: string, shelfSize: string): number {
  //     const shelfWidth = 150;
  //     const ratio = parseFloat(binSize) / parseFloat(shelfSize);
  //     return ratio * shelfWidth;
  //   }

  // new drag
  // getBarWidth(occupied: number, total: number): string {
  //   return ((occupied / total) * 100).toFixed(2) + '%';
  // }



  // get selectedRack(): Rack | null {
  //   return this.rackss.length > 0 ? this.rackss[this.selectedRackIndex] : null;
  // }

  // end drag

  // 2nd start 
  selectedZoneTypes: any[] = [];


  get allZoneTypes(): any[] {
    const types = this.dataSeconde.zone_data.map((z: any) => z);
    return [...new Set(types)];
  }

  getZoneDataByType(type: string) {
    return this.dataSeconde.zone_data.find((z: any) => z.zoneType === type);
  }

  hasZoneType(type: string): boolean {
    return this.selectedZoneTypes?.some(zone => zone.zoneType === type);
  }
  get rackZone() {
    return this.getZoneDataByType('Rack');
  }


  get bulkZone() {
    return this.getZoneDataByType('BulkStorage');
  }


  get selectedRack() {
    return this.rackZone?.rackss?.[this.selectedRackIndex] || null;
  }

  selectRack(index: number) {
    this.selectedRackIndex = index;
  }

  toggleShelfs(index: number) {
    const rack = this.selectedRack;
    if (rack && rack.shelves && rack.shelves[index]) {
      rack.shelves[index].expanded = !rack.shelves[index].expanded;
    }
  }

  getTotalZoneSize(): number {
    return this.dataSeconde.zone_data.reduce((sum: any, zone: any) => sum + (zone.zone_size || 0), 0);
  }

  dataSeconde: any
  fetchLayoutFromBackend() {

    this.dataSeconde = {
      totalArea: "3000",
      warehouse_id: 2,
      zone_data: [
        {
          zoneType: "Rack",
          zone_size: 700,
          dimentions: 2,
          rackss: [
            {
              rackName: 'Rack A',
              areaOfRack: "1000",
              rackSize: 1000,
              rackOccupiedCapacity: 100,
              rackOccupiedSize: 10,
              shelves: [
                {
                  shelfName: 'Shelf A',
                  shelfSize: 500,
                  occupied: 70,
                  expanded: false,
                  bins: [
                    { binName: 'Bin A1', binSize: 30, occupied: 80 },
                    { binName: 'Bin A2', binSize: 20, occupied: 90 },
                  ],
                },
              ],
            },
            {
              rackName: 'Rack B',
              areaOfRack: "500",
              rackSize: 1000,

              rackOccupiedCapacity: 100,
              rackOccupiedSize: 10,

              shelves: [
                {
                  shelfName: 'Shelf B',
                  shelfSize: 500,
                  occupied: 60,
                  expanded: false,
                  bins: [
                    { binName: 'Bin B1', binSize: 40, occupied: 60 },
                    { binName: 'Bin B2', binSize: 30, occupied: 80 },
                  ],
                },
                {
                  shelfName: 'Shelf p',
                  shelfSize: 100,
                  occupied: 20,
                  expanded: false,
                  bins: [
                    { binName: 'Bin B1', binSize: 40, occupied: 10 },
                    { binName: 'Bin B2', binSize: 30, occupied: 80 },
                  ],
                },
              ],
            },
          ]
        },
        {
          oneType: 'BulkStorage',
          zoneType: 'BulkStorage',
          zone_size: 500,
          occupied: 50,
          vacant: 50,
          attributes: {
            brssCapacity: 2,
            fragilityFactor: 4,
            temperatureControl: 4,
            zone_status: 1,
            stackingRules: 3,
            productCategoryCompatibility: 1,
          },
        }
      ]
    }

    this.totalArea = 1000;
    this.zoneSize = 700;

    this.rackss = [
      {
        rackName: 'Rack A',
        areaOfRack: "1000",
        rackSize: 1000,
        rackOccupiedCapacity: 100,
        rackOccupiedSize: 10,
        shelves: [
          {
            shelfName: 'Shelf A',
            shelfSize: 500,
            occupied: 70,
            expanded: false,
            bins: [
              { binName: 'Bin A1', binSize: 30, occupied: 80 },
              { binName: 'Bin A2', binSize: 20, occupied: 90 },
            ],
          },
        ],
      },
      {
        rackName: 'Rack B',
        areaOfRack: "500",
        rackSize: 1000,

        rackOccupiedCapacity: 100,
        rackOccupiedSize: 10,

        shelves: [
          {
            shelfName: 'Shelf B',
            shelfSize: 500,
            occupied: 60,
            expanded: false,
            bins: [
              { binName: 'Bin B1', binSize: 40, occupied: 60 },
              { binName: 'Bin B2', binSize: 30, occupied: 80 },
            ],
          },
          {
            shelfName: 'Shelf p',
            shelfSize: 100,
            occupied: 20,
            expanded: false,
            bins: [
              { binName: 'Bin B1', binSize: 40, occupied: 10 },
              { binName: 'Bin B2', binSize: 30, occupied: 80 },
            ],
          },
        ],
      },
    ];

    this.bulk = {
      zoneType: 'BulkStorage',
      zone: 'BulkStorage',
      size: 500,
      occupied: 50,
      vacant: 50,
      attributes: {
        brssCapacity: 2,
        fragilityFactor: 4,
        temperatureControl: 4,
        zone_status: 1,
        stackingRules: 3,
        productCategoryCompatibility: 1,
      },
    };
  }

  // selectRack(index: number): void {
  //   this.selectedRackIndex = index;
  // }

  // toggleShelfs(index: number): void {
  //   const shelf = this.selectedRack?.shelves[index];
  //   if (shelf) {
  //     shelf.expanded = !shelf.expanded;
  //   }
  // }

  getAllCat: any = []
  getAllCategory() {
    this._configurationalMasterService.getAssetMasterList().subscribe((res: any) => {
      this.getAllCat = res.data;
    }, (err: any) => {
      this.getAllCat = []
    })
  }


}
