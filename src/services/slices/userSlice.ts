import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TUser } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';
import {
  getUserApi,
  registerUserApi,
  TRegisterData,
  TAuthResponse,
  logoutApi,
  updateUserApi,
  loginUserApi,
  TLoginData
} from '@api';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

interface IUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
  // loading: boolean;
}

export const registerUser = createAsyncThunk(
  'user/registration',
  async (userData: TRegisterData) => registerUserApi(userData)
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: TRegisterData) => updateUserApi(userData)
);

// export const checkUserAuth = createAsyncThunk('user/checkUserAuth', async () =>
//   getUserApi()
// );

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((data) => dispatch(setUser(data.user)))
        .catch(() => {
          console.log('Ошибка аутентификации пользователя');
        })
        .finally(() => {
          dispatch(setIsAuthChecked());
        });
    } else {
      dispatch(setIsAuthChecked());
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (userData: TLoginData) => loginUserApi(userData)
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        dispatch(logout());
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      });
  }
);

const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  error: null
  // loading: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
    logout: (state) => {
      state.user = null;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked
    // isLoadingIngredients: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        // state.loading = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'ошибка регистрации пользователя';
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          // state.loading = false;
          state.isAuthChecked = true;
          state.error = null;
          state.user = action.payload.user;
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          setCookie('accessToken', action.payload.accessToken);
          console.log(
            `Сработал registerUser.fulfilled Регистрация!!!  User ${JSON.stringify(state.user)}
          + isAuthChecked ${state.isAuthChecked}
          + accessToken ${action.payload.accessToken}
          + refreshToken ${action.payload.refreshToken}`
          );
        }
      )
      // .addCase(checkUserAuth.pending, (state) => {
      //   state.error = null;
      //   // state.loading = true;
      // })
      // .addCase(checkUserAuth.rejected, (state, action) => {
      //   state.isAuthChecked = true;
      //   state.error = action.error.message || 'ошибка при аутентификации';
      //   console.log(state.error);
      //   // state.loading = false;
      // })
      // .addCase(checkUserAuth.fulfilled, (state, action) => {
      //   state.user = action.payload.user;
      //   state.isAuthChecked = true;
      //   state.error = null;
      //   // state.loading = false;
      // })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        // state.loading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error =
          action.error.message || 'ошибка обновления данных пользователя';
        console.log(state.error);
        // state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
        // state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        // state.loading = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'ошибка при логине пользователя';
        console.log(state.error);
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          // state.loading = false;
          state.isAuthChecked = true;
          state.error = null;
          state.user = action.payload.user;
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          setCookie('accessToken', action.payload.accessToken);
          console.log(
            `ЛОГИН!!! User ${JSON.stringify(state.user)}
          + isAuthChecked ${state.isAuthChecked}
          + accessToken ${action.payload.accessToken}
          + refreshToken ${action.payload.refreshToken}`
          );
        }
      );
    // .addCase(logoutUser.pending, (state) => {
    //     state.error = null;
    //   })
    // .addCase(logoutUser.rejected, (state, action) => {
    //     state.error = action.error.message as string;
    //   })
    // .addCase(logoutUser.fulfilled, (state) => {
    //     state.user = null;
    //     state.error = null;
    // })
  }
});

export const { setUser, setIsAuthChecked, logout } = userSlice.actions;

export const { getUser, getIsAuthChecked } = userSlice.selectors;
