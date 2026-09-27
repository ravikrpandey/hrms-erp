import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryRejectComponent } from './salery-reject.component';

describe('SaleryRejectComponent', () => {
  let component: SaleryRejectComponent;
  let fixture: ComponentFixture<SaleryRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleryRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
