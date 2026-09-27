import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreManagementListComponent } from './store-management-list.component';


describe('StoreManagementListComponent', () => {
  let component: StoreManagementListComponent;
  let fixture: ComponentFixture<StoreManagementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreManagementListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
