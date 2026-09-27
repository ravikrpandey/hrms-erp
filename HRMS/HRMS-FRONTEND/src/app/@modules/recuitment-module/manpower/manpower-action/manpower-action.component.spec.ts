import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionComponent } from './manpower-action.component';

describe('JobActionComponent', () => {
  let component: JobActionComponent;
  let fixture: ComponentFixture<JobActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
