import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-asset-header',
  templateUrl: './asset-header.component.html',
  styleUrls: ['./asset-header.component.scss']
})
export class AssetHeaderComponent implements OnInit, OnDestroy {

  buttons = [
    { label: 'Basic Details', path: '/master/asset-management/asset-list/basic-details', active: false },
    { label: 'Docs', path: '/master/asset-management/asset-list/docs', active: false },
    { label: 'Depreciation', path: '/master/asset-management/asset-list/depreciation', active: false },
    { label: 'Maintenance', path: '/master/asset-management/asset-list/maintenance', active: false },
    { label: 'Warranty ', path: '/master/asset-management/asset-list/warranty', active: false },
    { label: 'History', path: '/master/asset-management/asset-list/history', active: false },
  ];
  id: any;
  rowdata: any;
  urlData: any;
  grn_id: any;

  private destroy$ = new Subject<void>();

  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private asset_service: AssetListService
  ) { }

  ngOnInit(): void {
    this.urlData = environment.servralUrl;
    this.updateActiveState();

    this.activeroute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.id = params.id;
        this.grn_id = params.grn_id;
        this.getAllbasicdetails();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateActiveState(): void {
    const currentRoute = this.router.url;
    this.buttons.forEach(button => {
      button.active = currentRoute.includes(button.path);
    });
  }

  onButtonClick(clickedButton: any) {
    this.router.navigate([clickedButton.path], { queryParams: { id: this.id, grn_id: this.grn_id } });
  }

  getAllbasicdetails() {
    if (this.id) {
      this.asset_service.getBasicDetailsForAsset(this.id).subscribe((res: any) => {
        if (res.response) {
          this.rowdata = res.response;
        }
      }, (err: any) => {
        console.error('Error fetching asset basic details:', err);
      });
    }
  }
}
