import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssetCreateComponent } from './product-asset-create.component';

describe('ProductAssetCreateComponent', () => {
  let component: ProductAssetCreateComponent;
  let fixture: ComponentFixture<ProductAssetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAssetCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAssetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
