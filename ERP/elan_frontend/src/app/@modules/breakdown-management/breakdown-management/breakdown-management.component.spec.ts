import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownManagementComponent } from './breakdown-management.component';

describe('BreakdownManagementComponent', () => {
  let component: BreakdownManagementComponent;
  let fixture: ComponentFixture<BreakdownManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakdownManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreakdownManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
