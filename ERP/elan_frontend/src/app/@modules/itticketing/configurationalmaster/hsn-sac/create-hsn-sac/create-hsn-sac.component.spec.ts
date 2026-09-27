import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHsnSacComponent } from './create-hsn-sac.component';

describe('CreateHsnSacComponent', () => {
  let component: CreateHsnSacComponent;
  let fixture: ComponentFixture<CreateHsnSacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateHsnSacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHsnSacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
