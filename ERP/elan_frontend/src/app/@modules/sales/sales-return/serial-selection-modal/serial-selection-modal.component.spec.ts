import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialSelectionModalComponent } from './serial-selection-modal.component';

describe('SerialSelectionModalComponent', () => {
  let component: SerialSelectionModalComponent;
  let fixture: ComponentFixture<SerialSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialSelectionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerialSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
