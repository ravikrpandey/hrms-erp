import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProfileActionComponent } from './search-profile-action.component';

describe('SearchProfileActionComponent', () => {
  let component: SearchProfileActionComponent;
  let fixture: ComponentFixture<SearchProfileActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchProfileActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchProfileActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
