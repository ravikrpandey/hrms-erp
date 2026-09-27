import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeRejectComponent } from './extra-hour-reject.component';

describe('OvertimeRejectComponent', () => {
  let component: OvertimeRejectComponent;
  let fixture: ComponentFixture<OvertimeRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvertimeRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
