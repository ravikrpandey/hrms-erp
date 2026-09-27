import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoHistoryComponent } from './so-history.component';

describe('SoHistoryComponent', () => {
  let component: SoHistoryComponent;
  let fixture: ComponentFixture<SoHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
