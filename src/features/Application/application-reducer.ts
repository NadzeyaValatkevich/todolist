import {authApi} from "../../api/todolists-api";
import {authActions} from "../Auth";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "../CommonActions/AppActions";

const initializeApp = createAsyncThunk('application/initializeApp', async (param, {dispatch}) => {
    const res = await authApi.me();
    if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedInAC({value: true}))
    }
});

export const asyncActions = {
    initializeApp
};

export const slice = createSlice({
    name: 'app',
    initialState: {
        error: null,
        status: 'idle',
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    },
    extraReducers: builder => {
        builder
            .addCase(initializeApp.fulfilled, (state) => {
                state.isInitialized = true
            })
            .addCase(appActions.setError, (state, action) => {
                state.error = action.payload.error
            })
            .addCase(appActions.setStatus, (state, action) => {
                state.status = action.payload.status
            })
    }
});

// export const appReducer = slice.reducer;
// export const {setErrorAC, setStatusAC} = slice.actions;
export type RequestStatusType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
};
type InitialStateType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
    isInitialized: boolean
};
