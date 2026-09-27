import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkFlowPrpoComponent } from './add-work-flow-prpo.component';

describe('AddWorkFlowPrpoComponent', () => {
  let component: AddWorkFlowPrpoComponent;
  let fixture: ComponentFixture<AddWorkFlowPrpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkFlowPrpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkFlowPrpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
