import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterCopyComponent } from './product-master-copy.component';

describe('ProductMasterCopyComponent', () => {
  let component: ProductMasterCopyComponent;
  let fixture: ComponentFixture<ProductMasterCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMasterCopyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMasterCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
