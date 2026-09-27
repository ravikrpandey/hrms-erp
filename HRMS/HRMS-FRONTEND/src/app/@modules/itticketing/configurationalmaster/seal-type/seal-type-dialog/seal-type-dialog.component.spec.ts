import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SealTypeDialogComponent } from './seal-type-dialog.component';

describe('SealTypeDialogComponent', () => {
  let component: SealTypeDialogComponent;
  let fixture: ComponentFixture<SealTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SealTypeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SealTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
