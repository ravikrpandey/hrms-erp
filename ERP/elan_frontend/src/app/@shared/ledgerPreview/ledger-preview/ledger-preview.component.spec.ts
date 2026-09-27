import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerPreviewComponent } from './ledger-preview.component';

describe('LedgerPreviewComponent', () => {
  let component: LedgerPreviewComponent;
  let fixture: ComponentFixture<LedgerPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
