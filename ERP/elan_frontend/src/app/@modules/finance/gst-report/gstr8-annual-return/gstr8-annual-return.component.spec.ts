import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gstr8AnnualReturnComponent } from './gstr8-annual-return.component';

describe('Gstr8AnnualReturnComponent', () => {
  let component: Gstr8AnnualReturnComponent;
  let fixture: ComponentFixture<Gstr8AnnualReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Gstr8AnnualReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gstr8AnnualReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
