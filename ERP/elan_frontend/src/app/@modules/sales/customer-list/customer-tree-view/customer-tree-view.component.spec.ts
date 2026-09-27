import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTreeViewComponent } from './customer-tree-view.component';

describe('CustomerTreeViewComponent', () => {
  let component: CustomerTreeViewComponent;
  let fixture: ComponentFixture<CustomerTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTreeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
