import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManpowerRequestComponent } from './manpower-request.component';

describe('ManpowerRequestComponent', () => {
  let component: ManpowerRequestComponent;
  let fixture: ComponentFixture<ManpowerRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManpowerRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManpowerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
