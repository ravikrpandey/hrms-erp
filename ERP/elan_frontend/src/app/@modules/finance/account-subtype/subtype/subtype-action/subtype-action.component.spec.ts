import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtypeActionComponent } from './subtype-action.component';

describe('SubtypeActionComponent', () => {
  let component: SubtypeActionComponent;
  let fixture: ComponentFixture<SubtypeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtypeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtypeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
