import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
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

interface IUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  error: null,
  loading: false
};

export const registerUser = createAsyncThunk(
  'user/registration',
  async (userData: TRegisterData) => {
    const res = await registerUserApi(userData);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (userData: TLoginData) => {
    const res = await loginUserApi(userData);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: TRegisterData) => updateUserApi(userData)
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const res = await getUserApi();
        dispatch(setUser(res.user));
      } catch {
        () => {
          console.log('Ошибка аутентификации пользователя');
        };
      } finally {
        dispatch(setIsAuthChecked());
      }
    } else {
      dispatch(setIsAuthChecked());
    }
  }
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
    getIsAuthChecked: (state) => state.isAuthChecked,
    isLoadingUser: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.loading = false;
        state.error = action.error.message || 'ошибка регистрации пользователя';
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.user = action.payload.user;
          state.isAuthChecked = true;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error =
          action.error.message || 'ошибка обновления данных пользователя';
        console.log(state.error);
        state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'ошибка при логине пользователя';
        state.isAuthChecked = true;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.user = action.payload.user;
          state.isAuthChecked = true;
          state.loading = false;
          state.error = null;
        }
      );
  }
});

export const { setUser, setIsAuthChecked, logout } = userSlice.actions;

export const { getUser, getIsAuthChecked, isLoadingUser } = userSlice.selectors;
