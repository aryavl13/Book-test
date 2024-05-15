

import {Action, EnhancedStore, StoreEnhancer, ThunkAction, ThunkDispatch, Tuple, UnknownAction, configureStore} from "@reduxjs/toolkit"
import authReducer from './features/auth';
import homeReducer from './features/home';

export const store = configureStore({
    reducer:{
        auth:authReducer,
        home:homeReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
