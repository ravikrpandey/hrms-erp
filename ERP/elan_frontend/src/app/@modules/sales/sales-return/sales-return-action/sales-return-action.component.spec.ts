import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnActionComponent } from './sales-return-action.component';

describe('SalesReturnActionComponent', () => {
  let component: SalesReturnActionComponent;
  let fixture: ComponentFixture<SalesReturnActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReturnActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReturnActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
