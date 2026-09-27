import { MyExpencePipe } from './my-expence.pipe';

describe('MyExpencePipe', () => {
  it('create an instance', () => {
    const pipe = new MyExpencePipe();
    expect(pipe).toBeTruthy();
  });
});
