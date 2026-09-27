import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfNeedStatusComponent } from './type-of-need-status.component';

describe('TypeOfNeedStatusComponent', () => {
  let component: TypeOfNeedStatusComponent;
  let fixture: ComponentFixture<TypeOfNeedStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfNeedStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfNeedStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
