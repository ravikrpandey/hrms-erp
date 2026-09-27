import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateInwardListComponent } from './gate-inward-list.component';

describe('GateInwardListComponent', () => {
  let component: GateInwardListComponent;
  let fixture: ComponentFixture<GateInwardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GateInwardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GateInwardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
