import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcDiscriptionComponent } from './amc-discription.component';

describe('AmcDiscriptionComponent', () => {
  let component: AmcDiscriptionComponent;
  let fixture: ComponentFixture<AmcDiscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmcDiscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmcDiscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
