import { configureStore } from '@reduxjs/toolkit';
import masterDataReducer from './slices/masterDataSlice';
import filteredBrandReducer from './slices/filteredItemsSlice';
import formResponsesReducer from './slices/formResponsesSlice';

export const store = configureStore({
  reducer: {
    masterData: masterDataReducer,
    filteredBrand: filteredBrandReducer,
    formResponses: formResponsesReducer,
  },
});
