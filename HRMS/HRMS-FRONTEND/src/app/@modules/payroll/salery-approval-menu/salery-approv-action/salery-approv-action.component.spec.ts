import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryApprovActionComponent } from './salery-approv-action.component';

describe('SaleryApprovActionComponent', () => {
  let component: SaleryApprovActionComponent;
  let fixture: ComponentFixture<SaleryApprovActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryApprovActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleryApprovActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
