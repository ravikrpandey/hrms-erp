import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkFlowRfpComponent } from './add-work-flow-rfp.component';

describe('AddWorkFlowRfpComponent', () => {
  let component: AddWorkFlowRfpComponent;
  let fixture: ComponentFixture<AddWorkFlowRfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkFlowRfpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkFlowRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
