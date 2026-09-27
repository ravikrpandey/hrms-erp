import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Achivers } from './achivers';

describe('Achivers', () => {
  let component: Achivers;
  let fixture: ComponentFixture<Achivers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Achivers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Achivers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
