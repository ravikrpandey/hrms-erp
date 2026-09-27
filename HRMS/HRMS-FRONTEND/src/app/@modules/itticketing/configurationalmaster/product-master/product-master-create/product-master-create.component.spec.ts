import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterCreateComponent } from './product-master-create.component';

describe('ProductMasterCreateComponent', () => {
  let component: ProductMasterCreateComponent;
  let fixture: ComponentFixture<ProductMasterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMasterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMasterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
