import { createReducer } from '@reduxjs/toolkit';
import { setData, setUserInput } from './actions';

interface Data {
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
  }

interface DataState {
  data: Data[] | null;
  userInput: string;
}

const initialState: DataState = {
  data: null,
  userInput: 'Litecoin',
};

const dataReducer = createReducer(initialState, (builder) => {
  builder.addCase(setData, (state, action) => {
    state.data = action.payload;
  });
  builder.addCase(setUserInput, (state, action) => {
    state.userInput = action.payload;
    // console.log('Redux: userInput updated ', state.userInput);
  });
});

export default dataReducer;
