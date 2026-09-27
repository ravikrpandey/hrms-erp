import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListDialogComponent } from './emp-list-dialog.component';

describe('JobListDialogComponent', () => {
  let component: JobListDialogComponent;
  let fixture: ComponentFixture<JobListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
