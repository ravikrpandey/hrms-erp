import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcmReportsListComponent } from './rcm-reports-list.component';

describe('RcmReportsListComponent', () => {
  let component: RcmReportsListComponent;
  let fixture: ComponentFixture<RcmReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcmReportsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RcmReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
