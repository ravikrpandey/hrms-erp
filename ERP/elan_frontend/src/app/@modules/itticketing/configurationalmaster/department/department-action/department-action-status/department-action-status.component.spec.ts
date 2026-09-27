import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentActionStatusComponent } from './department-action-status.component';

describe('DepartmentActionStatusComponent', () => {
  let component: DepartmentActionStatusComponent;
  let fixture: ComponentFixture<DepartmentActionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentActionStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentActionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
