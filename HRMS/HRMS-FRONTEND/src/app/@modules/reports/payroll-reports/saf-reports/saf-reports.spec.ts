import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafReports } from './saf-reports';

describe('SafReports', () => {
  let component: SafReports;
  let fixture: ComponentFixture<SafReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
