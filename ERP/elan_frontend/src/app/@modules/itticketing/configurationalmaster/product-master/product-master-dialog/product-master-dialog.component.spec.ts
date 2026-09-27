import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterDialogComponent } from './product-master-dialog.component';

describe('ProductMasterDialogComponent', () => {
  let component: ProductMasterDialogComponent;
  let fixture: ComponentFixture<ProductMasterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMasterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
