import {appReducer, setErrorAC, setStatusAC} from "./app-reducer";

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
    const endState = appReducer(startState, setErrorAC({error: 'some error'}));

    expect(endState.error).toBe('some error');
});

test('correct status message should be set', () => {
    const endState = appReducer(startState, setStatusAC({status: 'loading'}));

    expect(endState.status).toBe('loading');
});