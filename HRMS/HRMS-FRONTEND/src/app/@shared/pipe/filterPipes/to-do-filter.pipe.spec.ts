import { ToDoFilterPipe } from './to-do-filter.pipe';

describe('ToDoFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new ToDoFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
