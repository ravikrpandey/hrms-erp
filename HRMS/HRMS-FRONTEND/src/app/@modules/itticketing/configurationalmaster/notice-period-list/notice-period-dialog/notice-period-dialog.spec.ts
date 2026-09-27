import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticePeriodDialog } from './notice-period-dialog';

describe('NoticePeriodDialog', () => {
  let component: NoticePeriodDialog;
  let fixture: ComponentFixture<NoticePeriodDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticePeriodDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticePeriodDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
