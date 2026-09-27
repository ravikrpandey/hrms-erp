import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoHistoryActionComponent } from './so-history-action.component';

describe('SoHistoryActionComponent', () => {
  let component: SoHistoryActionComponent;
  let fixture: ComponentFixture<SoHistoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoHistoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoHistoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
