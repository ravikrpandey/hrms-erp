import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtActionComponent } from './pt-action.component';

describe('PtActionComponent', () => {
  let component: PtActionComponent;
  let fixture: ComponentFixture<PtActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PtActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PtActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
