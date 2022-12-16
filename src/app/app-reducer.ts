const initialState: InitialStateType = {
    error: null,
    status: 'idle'
};

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch(action.type) {
        case 'APP/SET_STATUS':
            return {...state, status: action.status}
        case 'APP/SET_ERROR':
            return {...state, error: action.error}
        default:
            return {...state}
    }
};

export const setErrorAC = (error: string | null) => ({type: 'APP/SET_ERROR', error} as const);
export const setStatusAC = (status: 'idle' | 'loading' | 'succeeded' | 'failed') => ({type: 'APP/SET_STATUS', status} as const);

export type RequestStatusType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
};
export type ActionsType = SetErrorActionType | SetStatusActionType;

export type InitialStateType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
};
type SetErrorActionType = ReturnType<typeof setErrorAC>;
type SetStatusActionType = ReturnType<typeof setStatusAC>;