import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyMasterDialogComponent } from './currency-master-dialog.component';

describe('CurrencyMasterDialogComponent', () => {
  let component: CurrencyMasterDialogComponent;
  let fixture: ComponentFixture<CurrencyMasterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyMasterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
