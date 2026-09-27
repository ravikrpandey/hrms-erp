import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MSAListComponent } from './msa-list.component';

describe('MSAListComponent', () => {
  let component: MSAListComponent;
  let fixture: ComponentFixture<MSAListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MSAListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MSAListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
