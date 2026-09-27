import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeApproveComponent } from './extra-hour-approve.component';

describe('OvertimeApproveComponent', () => {
  let component: OvertimeApproveComponent;
  let fixture: ComponentFixture<OvertimeApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvertimeApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
