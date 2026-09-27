import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdliReports } from './edli-reports';

describe('EdliReports', () => {
  let component: EdliReports;
  let fixture: ComponentFixture<EdliReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdliReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdliReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
