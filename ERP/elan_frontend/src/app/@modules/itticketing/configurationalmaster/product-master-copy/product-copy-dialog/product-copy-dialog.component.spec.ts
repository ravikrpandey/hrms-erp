import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCopyDialogComponent } from './product-copy-dialog.component';

describe('ProductCopyDialogComponent', () => {
  let component: ProductCopyDialogComponent;
  let fixture: ComponentFixture<ProductCopyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCopyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCopyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
