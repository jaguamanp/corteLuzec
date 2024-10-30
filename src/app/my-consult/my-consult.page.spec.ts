import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyConsultPage } from './my-consult.page';

describe('MyConsultPage', () => {
  let component: MyConsultPage;
  let fixture: ComponentFixture<MyConsultPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyConsultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
