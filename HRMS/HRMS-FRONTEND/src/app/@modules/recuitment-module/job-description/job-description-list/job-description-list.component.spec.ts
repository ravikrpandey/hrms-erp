import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionListComponent } from './job-description-list.component';

describe('JobDescriptionListComponent', () => {
  let component: JobDescriptionListComponent;
  let fixture: ComponentFixture<JobDescriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDescriptionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDescriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
