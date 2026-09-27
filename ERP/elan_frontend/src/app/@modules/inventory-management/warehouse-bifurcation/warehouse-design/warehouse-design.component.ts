import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { Rack, BulkStorage } from '../../interface/bifurcation.interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-warehouse-design',
  templateUrl: './warehouse-design.component.html',
  styleUrls: ['./warehouse-design.component.scss']
})
export class WarehouseDesignComponent {

  zoneExpanded: { [zoneIndex: number]: boolean } = {};
  dragData: any;
  selectedZoneType: string = '';
  selectedZoneData: any = null;
  changeDetection: ChangeDetectionStrategy.OnPush
  totalArea = 0;
  zoneSize = 0;
  showRacks: boolean = true;
  showBulkStorage: boolean = false;
  readonly panelOpenState = false;
  rackss: Rack[] = [];
  selectedRackIndex = 0;

  bulk!: BulkStorage;
  id: any;
  constructor(
    private inventoryService: InventoryManagementService,
    private activeroute: ActivatedRoute,
    private location: Location,
    private router: Router


  ) {

  }
  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params?.id
    })
    this.getById()
    const saved = localStorage.getItem('warehouseSections');
    if (saved) {
      this.sections = JSON.parse(saved);
    }
  }
  zone_data: any = []
  bulk_storage: any = []
  racksBinData: any = []
  warehouseData: any = []
  getById() {
    this.inventoryService.getByWarehouseBifurcation(this.id).subscribe((res: any) => {

      this.zone_data = res.data;
      this.racksBinData = res.data?.zone_data;
      this.bulk_storage = res.data?.zoneDataBulk
      this.fetchLayoutFromBackend(res?.data);
      const scale = 2;

      this.bulk_storage = this.bulk_storage.map((zone: any) => {
        const sideFt = Math.sqrt(zone.bulk_zone_area);
        const sidePx = sideFt * scale;

        const totalBoxes = Math.floor(zone.bulk_zone_area / (zone.sub_area || 10000));
        const subBoxes = Array.from({ length: totalBoxes }, (_, idx) => {
          const subSide = Math.sqrt(zone.sub_area || 10000);
          const subPx = subSide * scale;
          return { id: idx + 1, width: subPx + 'px', height: subPx + 'px', area: zone.sub_area || 10000 };
        });

        return {
          ...zone,
          width: sidePx + 'px',
          height: sidePx + 'px',
          subBoxes
        };
      });
      console.log(this.bulk_storage, 'bulk_storage')




      // for the zones

      // Example: 1 ft = 0.05 px (adjust for your screen)
      const scale1 = 2;

      this.warehouseData = this.racksBinData.map((zone: any) => {
        const zoneSize = parseFloat(zone.zone_size || '10000');
        const zoneSide = Math.sqrt(zoneSize) * scale1;

        const racks = (zone.racks || []).map((rack: any) => {
          const rackVolume = parseFloat(rack.rack_Of_volume || '1000');
          const rackSide = Math.sqrt(rackVolume) * scale1;

          const shelves = (rack.shelves || []).map((shelf: any) => {
            const shelfVolume = parseFloat(shelf.shelf_volume || '1000');
            const shelfSide = Math.sqrt(shelfVolume) * scale1;

            const bins = (shelf.bins || []).map((bin: any) => {
              const binVolume = parseFloat(bin.shelf_volume || '1000'); // use shelf_volume if bin_area missing
              const binSide = Math.sqrt(binVolume) * scale1;

              return {
                ...bin,
                width: binSide + 'px',
                height: binSide + 'px'
              };
            });

            return {
              ...shelf,
              width: shelfSide + 'px',
              height: shelfSide + 'px',
              bins
            };
          });

          return {
            ...rack,
            width: rackSide + 'px',
            height: rackSide + 'px',
            shelves
          };
        });

        return {
          ...zone,
          width: zoneSide + 'px',
          height: zoneSide + 'px',
          racks
        };
      });
      console.log(this.warehouseData, 'warehouseData')


    })


  }


  dropBulkStorage(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.bulk_storage, event.previousIndex, event.currentIndex);
  }

  dropZone(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.warehouseData, event.previousIndex, event.currentIndex);
  }

  dropRack(event: CdkDragDrop<any[]>, zoneIndex: number) {
    moveItemInArray(this.warehouseData[zoneIndex].racks, event.previousIndex, event.currentIndex);
  }

  dropShelf(event: CdkDragDrop<any[]>, zoneIndex: number, rackIndex: number) {
    moveItemInArray(this.warehouseData[zoneIndex].racks[rackIndex].shelves, event.previousIndex, event.currentIndex);
  }

  // Optional: For bins
  dropBin(event: CdkDragDrop<any[]>, zoneIndex: number, rackIndex: number, shelfIndex: number) {
    moveItemInArray(this.warehouseData[zoneIndex].racks[rackIndex].shelves[shelfIndex].bins, event.previousIndex, event.currentIndex);
  }


  recievingItems() {
    this.router.navigate(['/master/warehouse-management/warehouse-bifurcation/recieving-items'], { queryParams: { id: this.id } })
  }
  sections = [
    { name: 'LOADING DOCKS', description: 'Manage incoming and outgoing trucks' },
    { name: 'RECEIVING', description: 'Track and process received goods' },
    { name: 'SHIPPING', description: 'Prepare and dispatch shipments' }
  ];

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    localStorage.setItem('warehouseSections', JSON.stringify(this.sections));
  }

  sectionClicked(section: any) {
    if (section.name === 'RECEIVING') {
      this.recievingItems();
    }
  }

  goBack() {
    this.location.back();
  }
  dragDrop() {
    this.dragData = {
      totalArea: "3000",
      warehouse_id: 2,
      zone_data: [
        {
          zoneType: "Rack",
          zone_size: "2000",
          numberOfRacks: 2,
          what_product_stored: null,
          brss_capacity: null,
          fragility_factor: null,
          temperature_control: null,
          barcode: null,
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
          numberOfRacks: null,
          what_product_stored: null,
          brss_capacity: "2",
          fragility_factor: "3",
          temperature_control: "1",
          barcode: "3",
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

    const types = this.dataSeconde?.zone_data?.map((z: any) => z);
    return [...new Set(types)];
  }

  getZoneDataByType(type: string) {
    return this.dataSeconde.zone_data.find((z: any) => z.zoneType_id === Number(type));
  }

  hasZoneType(type: string): boolean {
    let changeVal = Number(type);
    return this.selectedZoneTypes.some(zone => zone.zoneType_id === changeVal);
  }
  get rackZone() {
    return this.selectedZoneTypes.length > 0 ? this.getZoneDataByType(this.selectedZoneTypes[0].zoneType_id.toString()) : null;
  }

  get bulkZone() {
    return this.getZoneDataByType('BulkStorage');
  }


  get selectedRack() {
    return this.rackZone?.racks?.[this.selectedRackIndex] || null;
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
  fetchLayoutFromBackend(res: any) {
    console.log(res, "res warehouse design");

    this.dataSeconde = res
    // this.dataSeconde={
    //   totalArea: "3000",
    //   warehouse_id: 2,
    //   zone_data:[
    //     {
    //       zoneType: "Rack",
    //       zone_size: 700,
    //       numberOfRacks: 2,
    //       rackss : [
    //         {
    //           rackName: 'Rack A',
    //           areaOfRack: "1000",
    //           rackSize: 1000,
    //           rackOccupiedCapacity:100,
    //           rackOccupiedSize:10,
    //           shelves: [
    //             {
    //               shelfName: 'Shelf A',
    //               shelfSize: 500,
    //               occupied: 70,
    //               expanded: false,
    //               bins: [
    //                 { binName: 'Bin A1', binSize: 30, occupied: 80 },
    //                 { binName: 'Bin A2', binSize: 20, occupied: 90 },
    //               ],
    //             },
    //           ],
    //         },
    //         {
    //           rackName: 'Rack B',
    //           areaOfRack: "500",
    //           rackSize: 1000,

    //           rackOccupiedCapacity:100,
    //           rackOccupiedSize:10,

    //           shelves: [
    //             {
    //               shelfName: 'Shelf B',
    //               shelfSize: 500,
    //               occupied: 60,
    //               expanded: false,
    //               bins: [
    //                 { binName: 'Bin B1', binSize: 40, occupied: 60 },
    //                 { binName: 'Bin B2', binSize: 30, occupied: 80 },
    //               ],
    //             },
    //             {
    //               shelfName: 'Shelf p',
    //               shelfSize: 100,
    //               occupied: 20,
    //               expanded: false,
    //               bins: [
    //                 { binName: 'Bin B1', binSize: 40, occupied: 10 },
    //                 { binName: 'Bin B2', binSize: 30, occupied: 80 },
    //               ],
    //             },
    //           ],
    //         },
    //       ]
    //     },
    //     {
    //       oneType: 'BulkStorage',
    //       zoneType: 'BulkStorage',
    //       zone_size: 500,
    //   occupied: 50,
    //   vacant: 50,
    //   attributes: {
    //     brssCapacity: 2,
    //     fragilityFactor: 4,
    //     temperatureControl: 4,
    //     barcode: 1,
    //     stackingRules: 3,
    //     productCategoryCompatibility: 1,
    //   },
    //     }
    //   ]
    // }

    // this.totalArea = 1000;
    // this.zoneSize = 700;

    // this.rackss = [
    //   {
    //     rackName: 'Rack A',
    //     areaOfRack: "1000",
    //     rackSize: 1000,
    //     rackOccupiedCapacity:100,
    //     rackOccupiedSize:10,
    //     shelves: [
    //       {
    //         shelfName: 'Shelf A',
    //         shelfSize: 500,
    //         occupied: 70,
    //         expanded: false,
    //         bins: [
    //           { binName: 'Bin A1', binSize: 30, occupied: 80 },
    //           { binName: 'Bin A2', binSize: 20, occupied: 90 },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     rackName: 'Rack B',
    //     areaOfRack: "500",
    //     rackSize: 1000,

    //     rackOccupiedCapacity:100,
    //     rackOccupiedSize:10,

    //     shelves: [
    //       {
    //         shelfName: 'Shelf B',
    //         shelfSize: 500,
    //         occupied: 60,
    //         expanded: false,
    //         bins: [
    //           { binName: 'Bin B1', binSize: 40, occupied: 60 },
    //           { binName: 'Bin B2', binSize: 30, occupied: 80 },
    //         ],
    //       },
    //       {
    //         shelfName: 'Shelf p',
    //         shelfSize: 100,
    //         occupied: 20,
    //         expanded: false,
    //         bins: [
    //           { binName: 'Bin B1', binSize: 40, occupied: 10 },
    //           { binName: 'Bin B2', binSize: 30, occupied: 80 },
    //         ],
    //       },
    //     ],
    //   },
    // ];

    // this.bulk = {
    //   zoneType: 'BulkStorage',
    //   zone: 'BulkStorage',
    //   size: 500,
    //   occupied: 50,
    //   vacant: 50,
    //   attributes: {
    //     brssCapacity: 2,
    //     fragilityFactor: 4,
    //     temperatureControl: 4,
    //     barcode: 1,
    //     stackingRules: 3,
    //     productCategoryCompatibility: 1,
    //   },
    // };
  }

  getBulkStorageItem() {
    this.router.navigate(['/master/warehouse-management/warehouse-bifurcation/warehouse-items'], { queryParams: { id: this.id, status: 'Bulk-storage' } })
  }
  navigateTo(data: any) {
    this.router.navigate(['/master/warehouse-management/warehouse-bifurcation/warehouse-items'], { queryParams: { id: data.id, status: 'rack' } })
  }


}

