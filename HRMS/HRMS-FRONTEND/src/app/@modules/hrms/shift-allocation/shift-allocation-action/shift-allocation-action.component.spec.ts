import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAllocationActionComponent } from './shift-allocation-action.component';

describe('ShiftAllocationActionComponent', () => {
  let component: ShiftAllocationActionComponent;
  let fixture: ComponentFixture<ShiftAllocationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftAllocationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftAllocationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
