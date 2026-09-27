import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListSignComponent } from './employee-list-sign.component';

describe('EmployeeListSignComponent', () => {
  let component: EmployeeListSignComponent;
  let fixture: ComponentFixture<EmployeeListSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeListSignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeListSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
