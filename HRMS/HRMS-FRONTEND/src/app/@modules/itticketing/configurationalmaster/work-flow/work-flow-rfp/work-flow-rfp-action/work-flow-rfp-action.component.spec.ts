import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowRfpActionComponent } from './work-flow-rfp-action.component';

describe('WorkFlowRfpActionComponent', () => {
  let component: WorkFlowRfpActionComponent;
  let fixture: ComponentFixture<WorkFlowRfpActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowRfpActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowRfpActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
