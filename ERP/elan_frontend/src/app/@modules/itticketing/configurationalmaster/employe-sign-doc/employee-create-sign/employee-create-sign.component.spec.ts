import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCreateSignComponent } from './employee-create-sign.component';

describe('EmployeeCreateSignComponent', () => {
  let component: EmployeeCreateSignComponent;
  let fixture: ComponentFixture<EmployeeCreateSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeCreateSignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCreateSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
