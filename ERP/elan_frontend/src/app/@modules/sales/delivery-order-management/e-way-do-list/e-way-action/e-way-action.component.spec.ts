import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWayActionComponent } from './e-way-action.component';

describe('EWayActionComponent', () => {
  let component: EWayActionComponent;
  let fixture: ComponentFixture<EWayActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EWayActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EWayActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
