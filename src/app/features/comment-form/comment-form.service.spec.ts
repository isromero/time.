import { TestBed } from '@angular/core/testing';

import { PostFormService } from './comment-form.service';

describe('PostFormService', () => {
  let service: PostFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
