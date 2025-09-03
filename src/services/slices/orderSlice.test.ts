import {
  ordersSlice,
  initialState,
  orderBurger,
  getOwnOrders,
  getFeedOrders,
  getOrderByNumber,
} from './orderSlice';

describe(`orderSlice - проверка обработки редьюсером экшенов генерируемых 
  при выполнении асинхронного запроса: экшены начала запроса, успешного 
  выполнения запроса и ошибки запроса`, () => {

  const mockOrder = {
    _id: '68b591da673086001ba85ce0',
    status: 'done',
    name: 'Марсианский бургер',
    createdAt: '2025-09-01T12:22:41.840Z',
    updatedAt: '2025-09-01T12:22:41.840Z',
    number: 66666,
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093c'
    ]
  };

  afterAll(() => {
    jest.restoreAllMocks();
  });
 
  describe('orderBurger', () => {

    test(`orderBurger.pending обработка экшена начала запроса`, () => {
    const action = { type: orderBurger.pending.type };
    const state = ordersSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      orderRequest: true,
      error: null
    })

    });

    test(`orderBurger.fullfiled обработка экшена успешного
      выполнения запроса`, () => {
      const action = {
        type: orderBurger.fulfilled.type,
        payload: {
          success: true,
          order: mockOrder,
          name: 'Марсианский бургер'
        }
      };
      
      const state = ordersSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        error: null,
        orderModalData: mockOrder
      });

    });

    test(`orderBurger.rejected обработка экшена ошибки запроса`, () => {
      const action = {
        type: orderBurger.rejected.type,
        error: { message: 'Ошибка загрузки заказа' }
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      error: 'Ошибка загрузки заказа'
      })
    });
  });
  describe('getOwnOrders', () => {
    
    test(`getOwnOrders.pending обработка экшена начала запроса`, () => {
    const action = { type: getOwnOrders.pending.type };
    const state = ordersSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      orderRequest: true,
      error: null
    })
  });

    test(`getOwnOrders.fullfiled обработка экшена успешного
      выполнения запроса`, () => {
      const action = {
        type: getOwnOrders.fulfilled.type,
        payload: [mockOrder]
      };
      
      const state = ordersSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        error: null,
        ownOrders: [mockOrder]
      });
    });

    test(`getOwnOrders.rejected обработка экшена ошибки запроса`, () => {
      const action = {
        type: getOwnOrders.rejected.type,
        error: { message: 'Ошибка загрузки собственных заказов' }
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      error: 'Ошибка загрузки собственных заказов'
    })
  });
  });
  describe('getFeedOrders', () => {

    test(`getFeedOrders.pending обработка экшена начала запроса`, () => {
      const action = { type: getFeedOrders.pending.type };
      const state = ordersSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orderRequest: true,
        error: null
      })
    });

    test(`getFeedOrders.fullfiled обработка экшена успешного
      выполнения запроса`, () => {
      const action = {
        type: getFeedOrders.fulfilled.type,
        payload: {
          success: true,
          orders: [mockOrder],
          total: 999,
          totalToday: 77
        }
      };
      
      const state = ordersSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        error: null,
        ordersFeed: {
          success: true,
          orders: [mockOrder],
          total: 999,
          totalToday: 77
        }
      });
    });

    test(`getFeedOrders.rejected обработка экшена ошибки запроса`, () => {
      const action = {
        type: orderBurger.rejected.type,
        error: { message: 'Ошибка загрузки собственных заказов' }
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      error: 'Ошибка загрузки собственных заказов'
      })
    });
  });
    describe('getOrderByNumber', () => {

    test(`getOrderByNumber.pending обработка экшена начала запроса`, () => {
    const action = { type: getOrderByNumber.pending.type };
    const state = ordersSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      orderRequest: true,
      error: null
    })

    });

    test(`getOrderByNumber.fullfiled обработка экшена успешного
      выполнения запроса`, () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: {
          success: true,
          orders: [mockOrder]
        }
      };
      
      const state = ordersSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        error: null,
        orderByNumber: mockOrder
      });

    });

    test(`getOrderByNumber.rejected обработка экшена ошибки запроса`, () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Ошибка получения заказа по номеру' }
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      error: 'Ошибка получения заказа по номеру'
      })
    });
  });
});
