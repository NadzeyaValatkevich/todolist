import {authApi, LoginParamsType} from "../../api/todolists-api";
import {AppThunk} from "../../app/store";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


const initialState: InitialStateType = {
    isLoggedIn: false
};

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case "login/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
};

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({
        type: 'login/SET-IS-LOGGED-IN',
        value
    } as const);

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
    dispatch(setStatusAC('loading'))
    authApi.login(data)
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
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
                dispatch(setIsLoggedInAC(false))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
};



// types

type InitialStateType = {
    isLoggedIn: boolean
};
type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
export type AuthActionsType = SetIsLoggedInActionType;
