import {
  userSlice,
  initialState,
  registerUser,
  loginUser,
  updateUser
} from './userSlice';

describe(`userSlice - проверка обработки редьюсером экшенов генерируемых при выполнении 
  асинхронного запроса: экшены начала запроса, успешного выполнения
  запроса и ошибки запроса`, () => {

  const mockUser = {
    email: '123@ya.ru',
    name: 'testName'
  };
  const mockAuthResponse = {
    refreshToken: `fdb8fdbecdc4c4c4c4c4c4c4c4c4c4c4c4
    c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4`,
    accessToken: `ijh83jgh309u3h5ji380ujg3983gj920g2fi
    kjg58u3gijew8ewrj493oijk43943kjm3`,
    user: mockUser
  }

  afterAll(() => {
    jest.restoreAllMocks();
  });
 
  describe('registerUser', () => {

    test(`registerUser.pending обработка экшена начала запроса`, () => {
      const action = { type: registerUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      })
    });

    test(`registerUser.fullfiled обработка экшена успешного
      выполнения запроса`, () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockAuthResponse
      };
      
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: null,
        isAuthChecked: true,
        user: mockUser
      });
    });

    test(`registerUser.rejected обработка экшена ошибки запроса`, () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'ошибка регистрации пользователя' }
      };
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'ошибка регистрации пользователя',
      isAuthChecked: true
      })
    });
  });
    describe('loginUser', () => {

    test(`loginUser.pending обработка экшена начала запроса`, () => {
      const action = { type: loginUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      })
    });

    test(`loginUser.fullfiled обработка экшена успешного
      выполнения запроса`, () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockAuthResponse
      };
      
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: null,
        isAuthChecked: true,
        user: mockUser
      });
    });

    test(`loginUser.rejected обработка экшена ошибки запроса`, () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'ошибка при логине пользователя' }
      };
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'ошибка при логине пользователя',
        isAuthChecked: true
      })
    });
  });
    describe('updateUser', () => {

    test(`updateUser.pending обработка экшена начала запроса`, () => {
    const action = { type: updateUser.pending.type };
    const state = userSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    })

    });

    test(`updateUser.fullfiled обработка экшена успешного
      выполнения запроса`, () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: mockAuthResponse
      };
      
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: null,
        user: mockUser
      });
    });

    test(`updateUser.rejected обработка экшена ошибки запроса`, () => {
      const action = {
        type: updateUser.rejected.type,
        error: { message: 'ошибка обновления данных пользователя' }
      };
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'ошибка обновления данных пользователя'
      })
    });
  });
});
