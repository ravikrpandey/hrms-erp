import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkFlowRfpComponent } from './view-work-flow-rfp.component';

describe('ViewWorkFlowRfpComponent', () => {
  let component: ViewWorkFlowRfpComponent;
  let fixture: ComponentFixture<ViewWorkFlowRfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWorkFlowRfpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWorkFlowRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
