import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfNeedComponent } from './type-of-need.component';

describe('TypeOfNeedComponent', () => {
  let component: TypeOfNeedComponent;
  let fixture: ComponentFixture<TypeOfNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfNeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
