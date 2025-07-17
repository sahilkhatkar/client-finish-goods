import { configureStore } from '@reduxjs/toolkit';
import imsDataReducer from './slices/gSheetData';
import masterDataReducer from './slices/masterDataSlice';
import filteredBrandReducer from './slices/filteredItemsSlice';

export const store = configureStore({
  reducer: {
    data: imsDataReducer,
    masterData: masterDataReducer,
    filteredBrand: filteredBrandReducer,
  },
});
