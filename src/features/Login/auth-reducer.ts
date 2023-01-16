import {authApi, FieldErrorType, LoginParamsType} from "../../api/todolists-api";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";

export const login = createAsyncThunk<{isLoggedIn: boolean}, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setStatusAC({status: 'loading'}));
    try {
        const res = await authApi.login(param);
        if(res.data.resultCode === 0) {
            thunkAPI.dispatch(setStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch(error: any) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
});

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
});

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

// thunks
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    authApi.logout()
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
};
