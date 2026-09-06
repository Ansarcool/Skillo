import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TFilterState = {
  selectedSubcategoryIds: string[];
  learningMode: 'all' | 'wantToLearn' | 'canTeach';
  gender: 'any' | 'male' | 'female';
  selectedCityIds: string[];
  search: string;
};

const initialState: TFilterState = {
  selectedSubcategoryIds: [],
  learningMode: 'all',
  gender: 'any',
  selectedCityIds: [],
  search: ''
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    toggleSubcategory: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedSubcategoryIds.includes(id)) {
        state.selectedSubcategoryIds = state.selectedSubcategoryIds.filter(
          (item) => item !== id
        );
      } else {
        state.selectedSubcategoryIds.push(id);
      }
    },
    toggleCategoryGroup: (
      state,
      action: PayloadAction<{ subcategoryIds: string[]; selectAll: boolean }>
    ) => {
      const { subcategoryIds, selectAll } = action.payload;
      if (selectAll) {
        subcategoryIds.forEach((id) => {
          if (!state.selectedSubcategoryIds.includes(id)) {
            state.selectedSubcategoryIds.push(id);
          }
        });
      } else {
        state.selectedSubcategoryIds = state.selectedSubcategoryIds.filter(
          (id) => !subcategoryIds.includes(id)
        );
      }
    },
    setLearningMode: (
      state,
      action: PayloadAction<'all' | 'wantToLearn' | 'canTeach'>
    ) => {
      state.learningMode = action.payload;
    },
    setGender: (state, action: PayloadAction<'any' | 'male' | 'female'>) => {
      state.gender = action.payload;
    },
    toggleCity: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedCityIds.includes(id)) {
        state.selectedCityIds = state.selectedCityIds.filter(
          (item) => item !== id
        );
      } else {
        state.selectedCityIds.push(id);
      }
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    resetFilters: () => initialState
  }
});

export const {
  toggleSubcategory,
  toggleCategoryGroup,
  setLearningMode,
  setGender,
  toggleCity,
  setSearch,
  resetFilters
} = filterSlice.actions;

export default filterSlice.reducer;
