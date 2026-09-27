import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrStatusDialogComponent } from './pr-status-dialog.component';

describe('PrStatusDialogComponent', () => {
  let component: PrStatusDialogComponent;
  let fixture: ComponentFixture<PrStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrStatusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
