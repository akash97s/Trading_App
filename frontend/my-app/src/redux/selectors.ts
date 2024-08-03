import { RootState } from './store';

export const selectData = (state: RootState) => state.data.data;
export const selectUserInput = (state: RootState) => state.data.userInput;
