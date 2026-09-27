import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowJobCreateComponent } from './work-flow-job-create.component';

describe('WorkFlowJobCreateComponent', () => {
  let component: WorkFlowJobCreateComponent;
  let fixture: ComponentFixture<WorkFlowJobCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowJobCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowJobCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
