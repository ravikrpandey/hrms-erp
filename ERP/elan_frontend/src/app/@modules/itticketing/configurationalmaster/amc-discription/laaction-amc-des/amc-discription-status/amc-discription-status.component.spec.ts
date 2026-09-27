import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcDiscriptionStatusComponent } from './amc-discription-status.component';

describe('AmcDiscriptionStatusComponent', () => {
  let component: AmcDiscriptionStatusComponent;
  let fixture: ComponentFixture<AmcDiscriptionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmcDiscriptionStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmcDiscriptionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
