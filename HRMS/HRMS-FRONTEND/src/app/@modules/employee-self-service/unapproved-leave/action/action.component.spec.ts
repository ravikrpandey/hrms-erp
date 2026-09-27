import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionForUnaprovedLeaveComponent } from './action.component';

describe('ActionForUnaprovedLeaveComponent', () => {
  let component: ActionForUnaprovedLeaveComponent;
  let fixture: ComponentFixture<ActionForUnaprovedLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionForUnaprovedLeaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionForUnaprovedLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
