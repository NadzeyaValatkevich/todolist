import {appActions} from "../features/CommonActions/AppActions";
import {ResponseType} from '../api/types'

type ThunkAPIType = {
    dispatch: (action: any) => any
    rejectWithValue: Function
}

export const handleAsyncServerAppError = <D>(data: ResponseType<D>,
                                             thunkAPI: ThunkAPIType,
                                             showError = true) => {
    if (showError) {
        thunkAPI.dispatch(appActions.setError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    }
    thunkAPI.dispatch(appActions.setStatus({status: 'failed'}));
    return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
};

export const handleAsyncServerNetworkError = (error: any,
                                              thunkAPI: ThunkAPIType,
                                              showError = true) => {
    if (showError) {
        thunkAPI.dispatch(appActions.setError({error: error.message ? error.message : 'Some error occurred'}))
    }
    thunkAPI.dispatch(appActions.setStatus({status: 'failed'}));
    return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
};