import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SealTypeComponent } from './seal-type.component';

describe('SealTypeComponent', () => {
  let component: SealTypeComponent;
  let fixture: ComponentFixture<SealTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SealTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SealTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
