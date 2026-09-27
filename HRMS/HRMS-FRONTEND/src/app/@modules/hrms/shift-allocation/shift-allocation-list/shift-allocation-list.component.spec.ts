import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAllocationListComponent } from './shift-allocation-list.component';

describe('ShiftAllocationListComponent', () => {
  let component: ShiftAllocationListComponent;
  let fixture: ComponentFixture<ShiftAllocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftAllocationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftAllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
