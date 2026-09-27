import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateInwardOutwardComponent } from './gate-inward-outward.component';

describe('GateInwardOutwardComponent', () => {
  let component: GateInwardOutwardComponent;
  let fixture: ComponentFixture<GateInwardOutwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GateInwardOutwardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GateInwardOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
