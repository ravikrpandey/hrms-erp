import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeRequestActionComponent } from './extra-request-action.component';

describe('OvertimeRequestActionComponent', () => {
  let component: OvertimeRequestActionComponent;
  let fixture: ComponentFixture<OvertimeRequestActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvertimeRequestActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeRequestActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
