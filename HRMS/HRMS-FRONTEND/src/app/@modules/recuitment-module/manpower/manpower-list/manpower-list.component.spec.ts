import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDiscriptionListComponent } from './manpower-list.component';

describe('JobDiscriptionListComponent', () => {
  let component: JobDiscriptionListComponent;
  let fixture: ComponentFixture<JobDiscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDiscriptionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDiscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
