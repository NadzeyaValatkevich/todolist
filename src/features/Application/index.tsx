import * as appSelectors from './selectors';
import {asyncActions, slice} from './application-reducer';

const appReducer = slice.reducer;
const actions = slice.actions;
const appActions = {
    ...actions,
    ...asyncActions
};

export {
    appSelectors,
    appReducer,
    appActions
}
