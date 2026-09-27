import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentActionComponent } from './indent-action.component';

describe('IndentActionComponent', () => {
  let component: IndentActionComponent;
  let fixture: ComponentFixture<IndentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
