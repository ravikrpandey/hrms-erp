import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoListActionComponent } from './po-list-action.component';

describe('PoListActionComponent', () => {
  let component: PoListActionComponent;
  let fixture: ComponentFixture<PoListActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoListActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoListActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
