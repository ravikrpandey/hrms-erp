import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationDialogComponent } from './negotiation-dialog.component';

describe('NegotiationDialogComponent', () => {
  let component: NegotiationDialogComponent;
  let fixture: ComponentFixture<NegotiationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NegotiationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NegotiationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
