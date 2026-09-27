import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfNeedActionComponent } from './type-of-need-action.component';

describe('TypeOfNeedActionComponent', () => {
  let component: TypeOfNeedActionComponent;
  let fixture: ComponentFixture<TypeOfNeedActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfNeedActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfNeedActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
