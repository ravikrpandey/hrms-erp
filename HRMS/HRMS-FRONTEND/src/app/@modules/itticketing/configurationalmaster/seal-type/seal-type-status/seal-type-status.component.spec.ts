import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SealTypeStatusComponent } from './seal-type-status.component';

describe('SealTypeStatusComponent', () => {
  let component: SealTypeStatusComponent;
  let fixture: ComponentFixture<SealTypeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SealTypeStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SealTypeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
