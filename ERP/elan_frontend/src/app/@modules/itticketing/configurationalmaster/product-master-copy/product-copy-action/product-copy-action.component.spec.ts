import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCopyActionComponent } from './product-copy-action.component';

describe('ProductCopyActionComponent', () => {
  let component: ProductCopyActionComponent;
  let fixture: ComponentFixture<ProductCopyActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCopyActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCopyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
