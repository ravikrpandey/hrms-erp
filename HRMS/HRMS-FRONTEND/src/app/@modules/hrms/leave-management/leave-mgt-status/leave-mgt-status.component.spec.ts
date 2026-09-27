import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveMgtStatusComponent } from './leave-mgt-status.component';

describe('LeaveMgtStatusComponent', () => {
  let component: LeaveMgtStatusComponent;
  let fixture: ComponentFixture<LeaveMgtStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveMgtStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveMgtStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
