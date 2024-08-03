import { createAction } from '@reduxjs/toolkit';

interface Data {
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
}

export const setData = createAction<Data[]>('SET_DATA');
export const setUserInput = createAction<string>('SET_USER_INPUT');
