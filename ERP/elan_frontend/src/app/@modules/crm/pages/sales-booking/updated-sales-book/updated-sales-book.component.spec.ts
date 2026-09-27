import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedSalesBookComponent } from './updated-sales-book.component';

describe('SalesBookingApprovedComponent', () => {
  let component: UpdatedSalesBookComponent;
  let fixture: ComponentFixture<UpdatedSalesBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatedSalesBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatedSalesBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
