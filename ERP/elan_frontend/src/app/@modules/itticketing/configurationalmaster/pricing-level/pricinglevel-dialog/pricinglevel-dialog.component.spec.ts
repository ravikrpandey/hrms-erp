import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricinglevelDialogComponent } from './pricinglevel-dialog.component';

describe('PricinglevelDialogComponent', () => {
  let component: PricinglevelDialogComponent;
  let fixture: ComponentFixture<PricinglevelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricinglevelDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricinglevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
