import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

interface IIngredientsState {
  ingredients: TIngredient[];
  burgerConstructor: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  ingredients: [],
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const newIngredient = action.payload;
        if (newIngredient.type === 'bun') {
          state.burgerConstructor.bun = newIngredient;
        } else {
          state.burgerConstructor.ingredients.push(newIngredient);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } as TConstructorIngredient };
      }
    },
    swapIngredients: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      [
        state.burgerConstructor.ingredients[from],
        state.burgerConstructor.ingredients[to]
      ] = [
        state.burgerConstructor.ingredients[to],
        state.burgerConstructor.ingredients[from]
      ];
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.burgerConstructor.ingredients =
        state.burgerConstructor.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
    clearConstructor: (state) => {
      state.burgerConstructor.ingredients = [];
      state.burgerConstructor.bun = null;
    }
  },
  selectors: {
    getIngredients: (state) => state.ingredients,
    getItemsConstructor: (state) => state.burgerConstructor,
    isLoadingIngredients: (state) => state.loading,
    getItemsForOrder: createSelector(
      (state: IIngredientsState) => state.burgerConstructor,
      (burgerConstructor) => {
        const items = [
          burgerConstructor.bun,
          ...burgerConstructor.ingredients,
          burgerConstructor.bun
        ];
        return items.map((item) => item?._id);
      }
    )
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
        state.error = null;
      });
  }
});

export const {
  addIngredient,
  swapIngredients,
  removeIngredient,
  clearConstructor
} = ingredientsSlice.actions;

export const {
  getIngredients,
  getItemsConstructor,
  getItemsForOrder,
  isLoadingIngredients
} = ingredientsSlice.selectors;
