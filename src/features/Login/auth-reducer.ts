import {authApi, LoginParamsType} from "../../api/todolists-api";
import {AppThunk} from "../../app/store";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn: false
};

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        }
    }
});

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
    dispatch(setStatusAC('loading'))
    authApi.login(data)
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
};

export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(setStatusAC('loading'))
    authApi.logout()
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
};
