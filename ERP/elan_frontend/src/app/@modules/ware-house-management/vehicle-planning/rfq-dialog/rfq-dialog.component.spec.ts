import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqDialogComponent } from './rfq-dialog.component';

describe('RfqDialogComponent', () => {
  let component: RfqDialogComponent;
  let fixture: ComponentFixture<RfqDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
