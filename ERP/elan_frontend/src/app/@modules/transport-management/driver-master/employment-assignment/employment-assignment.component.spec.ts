import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentAssignmentComponent } from './employment-assignment.component';

describe('EmploymentAssignmentComponent', () => {
  let component: EmploymentAssignmentComponent;
  let fixture: ComponentFixture<EmploymentAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploymentAssignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploymentAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
