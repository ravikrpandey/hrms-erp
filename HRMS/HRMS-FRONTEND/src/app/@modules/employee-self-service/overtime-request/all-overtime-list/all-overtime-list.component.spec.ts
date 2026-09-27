import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOvertimeListComponent } from './all-overtime-list.component';

describe('AllOvertimeListComponent', () => {
  let component: AllOvertimeListComponent;
  let fixture: ComponentFixture<AllOvertimeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllOvertimeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOvertimeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
