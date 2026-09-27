import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTermsUnloadingComponent } from './create-terms-unloading.component';

describe('CreateTermsUnloadingComponent', () => {
  let component: CreateTermsUnloadingComponent;
  let fixture: ComponentFixture<CreateTermsUnloadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTermsUnloadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTermsUnloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
