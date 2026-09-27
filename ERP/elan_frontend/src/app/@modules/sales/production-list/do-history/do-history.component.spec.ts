import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DOHistoryComponent } from './do-history.component';

describe('DOHistoryComponent', () => {
  let component: DOHistoryComponent;
  let fixture: ComponentFixture<DOHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DOHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DOHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
