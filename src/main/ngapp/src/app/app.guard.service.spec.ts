import { TestBed, inject } from '@angular/core/testing';

import { App.GuardService } from './app.guard.service';

describe('App.GuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [App.GuardService]
    });
  });

  it('should be created', inject([App.GuardService], (service: App.GuardService) => {
    expect(service).toBeTruthy();
  }));
});
