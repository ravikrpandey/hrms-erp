import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gstr9AnnualReturnComponent } from './gstr9-annual-return.component';

describe('Gstr9AnnualReturnComponent', () => {
  let component: Gstr9AnnualReturnComponent;
  let fixture: ComponentFixture<Gstr9AnnualReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Gstr9AnnualReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gstr9AnnualReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
