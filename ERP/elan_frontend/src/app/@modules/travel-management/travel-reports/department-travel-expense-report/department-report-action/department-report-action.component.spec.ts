import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentReportActionComponent } from './department-report-action.component';

describe('DepartmentReportActionComponent', () => {
  let component: DepartmentReportActionComponent;
  let fixture: ComponentFixture<DepartmentReportActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentReportActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentReportActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
