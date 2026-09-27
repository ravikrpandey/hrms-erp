import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateActionButtonComponent } from './gate-action-button.component';

describe('GateActionButtonComponent', () => {
  let component: GateActionButtonComponent;
  let fixture: ComponentFixture<GateActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GateActionButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GateActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
