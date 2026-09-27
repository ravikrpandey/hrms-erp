import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtCreateComponent } from './pt-create.component';

describe('PtCreateComponent', () => {
  let component: PtCreateComponent;
  let fixture: ComponentFixture<PtCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PtCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PtCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
