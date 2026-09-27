import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftMasterActionComponent } from './shift-master-action.component';

describe('ShiftMasterActionComponent', () => {
  let component: ShiftMasterActionComponent;
  let fixture: ComponentFixture<ShiftMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
