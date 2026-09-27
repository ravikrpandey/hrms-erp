import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitFormRemarksComponent } from './exit-form-remarks.component';

describe('ExitFormRemarksComponent', () => {
  let component: ExitFormRemarksComponent;
  let fixture: ComponentFixture<ExitFormRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitFormRemarksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitFormRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
