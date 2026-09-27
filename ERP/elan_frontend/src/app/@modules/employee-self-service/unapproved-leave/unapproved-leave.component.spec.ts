import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnapprovedLeaveComponent } from './unapproved-leave.component';

describe('UnapprovedLeaveComponent', () => {
  let component: UnapprovedLeaveComponent;
  let fixture: ComponentFixture<UnapprovedLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnapprovedLeaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnapprovedLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
