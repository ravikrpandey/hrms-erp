import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionCreateComponent } from './job-description-create.component';

describe('JobDescriptionCreateComponent', () => {
  let component: JobDescriptionCreateComponent;
  let fixture: ComponentFixture<JobDescriptionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDescriptionCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDescriptionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
