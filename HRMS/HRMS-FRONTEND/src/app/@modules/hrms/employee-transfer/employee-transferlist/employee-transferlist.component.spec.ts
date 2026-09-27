import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTransferlistComponent } from './employee-transferlist.component';

describe('EmployeeTransferlistComponent', () => {
  let component: EmployeeTransferlistComponent;
  let fixture: ComponentFixture<EmployeeTransferlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTransferlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTransferlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
