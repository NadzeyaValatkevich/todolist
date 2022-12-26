import {AppThunk} from "./store";
import {authApi} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";

const initialState: InitialStateType = {
    error: null,
    status: 'idle',
    isInitialized: false
};

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch(action.type) {
        case 'APP/SET_STATUS':
            return {...state, status: action.status}
        case 'APP/SET_ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return {...state}
    }
};

export const setErrorAC = (error: string | null) => ({type: 'APP/SET_ERROR', error} as const);
export const setStatusAC = (status: 'idle' | 'loading' | 'succeeded' | 'failed') => ({type: 'APP/SET_STATUS', status} as const);
export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-IS-INITIALIZED', value} as const);

export const initializeAppTC = (): AppThunk => (dispatch) => {
    authApi.me()
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
            } else {

            }
            dispatch(setAppInitializedAC(true))
        })

}
export type RequestStatusType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
};
export type ActionsType = SetErrorActionType | SetStatusActionType | SetAppInitializedActionType;

export type InitialStateType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
    isInitialized: boolean
};

type SetErrorActionType = ReturnType<typeof setErrorAC>;
type SetStatusActionType = ReturnType<typeof setStatusAC>;
type SetAppInitializedActionType = ReturnType<typeof setAppInitializedAC>;