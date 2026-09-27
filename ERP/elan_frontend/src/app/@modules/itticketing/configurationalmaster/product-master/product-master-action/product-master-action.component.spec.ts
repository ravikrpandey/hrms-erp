import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterActionComponent } from './product-master-action.component';

describe('ProductMasterActionComponent', () => {
  let component: ProductMasterActionComponent;
  let fixture: ComponentFixture<ProductMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
