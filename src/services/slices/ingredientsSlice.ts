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
  items: TIngredient[];
  itemsConstructor: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  loading: boolean;
  error: string | null;
}

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => getIngredientsApi()
);

const initialState: IIngredientsState = {
  items: [],
  itemsConstructor: {
    bun: null,
    ingredients: []
  },
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const newIngredient = action.payload;
        if (newIngredient.type === 'bun') {
          state.itemsConstructor.bun = newIngredient;
        } else {
          state.itemsConstructor.ingredients.push(newIngredient);
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
        state.itemsConstructor.ingredients[from],
        state.itemsConstructor.ingredients[to]
      ] = [
        state.itemsConstructor.ingredients[to],
        state.itemsConstructor.ingredients[from]
      ];
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.itemsConstructor.ingredients =
        state.itemsConstructor.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
    clearConstructor: (state) => {
      state.itemsConstructor.ingredients = [];
      state.itemsConstructor.bun = null;
    }
  },
  selectors: {
    getIngredients: (state) => state.items,
    getItemsConstructor: (state) => state.itemsConstructor,
    getItemsForOrder: createSelector(
      (state: IIngredientsState) => state.itemsConstructor,
      (itemsConstructor) => {
        const items = [
          itemsConstructor.bun,
          ...itemsConstructor.ingredients,
          itemsConstructor.bun
        ];
        return items.map((item) => item?._id);
      }
    ),
    isLoadingIngredients: (state) => state.loading
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
        state.items = action.payload;
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
