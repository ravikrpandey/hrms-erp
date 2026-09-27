import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeApprasalComponent } from './employee-apprasal.component';

describe('EmployeeApprasalComponent', () => {
  let component: EmployeeApprasalComponent;
  let fixture: ComponentFixture<EmployeeApprasalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeApprasalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeApprasalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
