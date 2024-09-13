import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumBuyComponent } from './premium-buy.component';

describe('PremiumBuyComponent', () => {
  let component: PremiumBuyComponent;
  let fixture: ComponentFixture<PremiumBuyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PremiumBuyComponent]
    });
    fixture = TestBed.createComponent(PremiumBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
