import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoActionComponent } from './so-action.component';

describe('SoActionComponent', () => {
  let component: SoActionComponent;
  let fixture: ComponentFixture<SoActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
