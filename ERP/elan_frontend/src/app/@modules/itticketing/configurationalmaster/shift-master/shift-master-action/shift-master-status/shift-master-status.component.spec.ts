import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftMasterStatusComponent } from './shift-master-status.component';

describe('ShiftMasterStatusComponent', () => {
  let component: ShiftMasterStatusComponent;
  let fixture: ComponentFixture<ShiftMasterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftMasterStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftMasterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
