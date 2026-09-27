import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowJobListComponent } from './work-flow-job-list.component';

describe('WorkFlowJobListComponent', () => {
  let component: WorkFlowJobListComponent;
  let fixture: ComponentFixture<WorkFlowJobListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowJobListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
