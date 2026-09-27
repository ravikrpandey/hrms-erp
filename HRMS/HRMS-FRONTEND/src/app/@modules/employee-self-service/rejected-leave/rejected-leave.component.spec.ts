import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedLeaveComponent } from './rejected-leave.component';

describe('RejectedLeaveComponent', () => {
  let component: RejectedLeaveComponent;
  let fixture: ComponentFixture<RejectedLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedLeaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
