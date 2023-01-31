import {authApi} from "../../api/todolists-api";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FieldErrorType, LoginParamsType} from "../../api/types";
import {appActions} from "../CommonActions/AppActions";

export const login = createAsyncThunk<undefined, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({status: 'loading'}));
    try {
        const res = await authApi.login(param);
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setStatus({status: 'succeeded'}))
            return
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error: any) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
});

export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const res = await authApi.logout();
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setStatus({status: 'succeeded'}))
            return
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error: any) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
});

export const asyncActions = {
    login,
    logout
};

export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false
            })
    }
});

// export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;
