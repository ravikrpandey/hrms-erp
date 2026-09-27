import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnActionComponent } from './grn-action.component';

describe('GrnActionComponent', () => {
  let component: GrnActionComponent;
  let fixture: ComponentFixture<GrnActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
