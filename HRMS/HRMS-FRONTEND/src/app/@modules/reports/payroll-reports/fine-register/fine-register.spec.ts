import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineRegister } from './fine-register';

describe('FineRegister', () => {
  let component: FineRegister;
  let fixture: ComponentFixture<FineRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FineRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
