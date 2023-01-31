import {appActions} from "../CommonActions/AppActions";
import {slice} from './application-reducer';

const {reducer: appReducer} = slice;
const {setError, setStatus} = appActions;

let startState: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
    isInitialized: boolean
};

beforeEach(() => {
    startState = {
        status: 'idle',
        error: null,
        isInitialized: false
    }
});

test('correct error message should be set', () => {
    const endState = appReducer(startState, setError({error: 'some error'}));

    expect(endState.error).toBe('some error');
});

test('correct status message should be set', () => {
    const endState = appReducer(startState, setStatus({status: 'loading'}));

    expect(endState.status).toBe('loading');
});