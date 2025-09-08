import { rootReducer } from './store';
import store from './store';

test('rootReducer настроен правильно и работает', () => {
  const testState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
  expect(testState).toEqual(store.getState());
});
