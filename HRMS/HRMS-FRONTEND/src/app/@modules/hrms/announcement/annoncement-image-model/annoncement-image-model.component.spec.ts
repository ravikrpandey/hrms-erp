import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncementImageModelComponent } from './annoncement-image-model.component';

describe('AnnoncementImageModelComponent', () => {
  let component: AnnoncementImageModelComponent;
  let fixture: ComponentFixture<AnnoncementImageModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnoncementImageModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnoncementImageModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
