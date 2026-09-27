import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ALLOvertimeListActionComponent } from './all-overtime-list-action.component';

describe('ALLOvertimeListActionComponent', () => {
  let component: ALLOvertimeListActionComponent;
  let fixture: ComponentFixture<ALLOvertimeListActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ALLOvertimeListActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ALLOvertimeListActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
