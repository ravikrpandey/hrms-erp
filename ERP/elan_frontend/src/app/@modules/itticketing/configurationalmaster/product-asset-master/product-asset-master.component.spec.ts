import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssetMasterComponent } from './product-asset-master.component';

describe('ProductAssetMasterComponent', () => {
  let component: ProductAssetMasterComponent;
  let fixture: ComponentFixture<ProductAssetMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAssetMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAssetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
