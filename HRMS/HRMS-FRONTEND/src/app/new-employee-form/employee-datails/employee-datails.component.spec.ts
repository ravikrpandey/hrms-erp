import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDatailsComponent } from './employee-datails.component';

describe('EmployeeDatailsComponent', () => {
  let component: EmployeeDatailsComponent;
  let fixture: ComponentFixture<EmployeeDatailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeDatailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDatailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
