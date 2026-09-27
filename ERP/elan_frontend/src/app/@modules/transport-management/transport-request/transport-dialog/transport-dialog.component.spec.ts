import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportDialogComponent } from './transport-dialog.component';

describe('TransportDialogComponent', () => {
  let component: TransportDialogComponent;
  let fixture: ComponentFixture<TransportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
