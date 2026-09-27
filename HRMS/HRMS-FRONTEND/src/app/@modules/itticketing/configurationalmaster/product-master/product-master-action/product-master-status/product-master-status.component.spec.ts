import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterStatusComponent } from './product-master-status.component';

describe('ProductMasterStatusComponent', () => {
  let component: ProductMasterStatusComponent;
  let fixture: ComponentFixture<ProductMasterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMasterStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMasterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
