import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkFlowPrpoComponent } from './view-work-flow-prpo.component';

describe('ViewWorkFlowPrpoComponent', () => {
  let component: ViewWorkFlowPrpoComponent;
  let fixture: ComponentFixture<ViewWorkFlowPrpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWorkFlowPrpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWorkFlowPrpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
