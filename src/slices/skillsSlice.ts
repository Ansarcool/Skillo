import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSkills, getSkillCards } from '../api/api.ts';
import type { TSkillCard } from '../api/api.ts';
export type TSkillItem = {
  id: number;
  name: string;
};

export type TSkillCategory = {
  id: number;
  category: string;
  icon: string;
  skills: TSkillItem[];
};
export type TSkillsState = {
  skills: TSkillCategory[];
  skillCards: TSkillCard[];
  isLoading: boolean;
  error: string | null;
};
const initialState: TSkillsState = {
  skills: [],
  skillCards: [],
  isLoading: false,
  error: null
};
export const getSkillsThunk = createAsyncThunk('skills/skill', () =>
  getSkills()
);

export const getSkillCardsThunk = createAsyncThunk('skills/cards', () =>
  getSkillCards()
);
export const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSkillsThunk.pending, (state) => {
        state.skills = [];
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSkillsThunk.fulfilled, (state, action) => {
        state.skills = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getSkillsThunk.rejected, (state, action) => {
        state.skills = [];
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      })
      .addCase(getSkillCardsThunk.pending, (state) => {
        state.skillCards = [];
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSkillCardsThunk.fulfilled, (state, action) => {
        state.skillCards = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getSkillCardsThunk.rejected, (state, action) => {
        state.skillCards = [];
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка';
      });
  }
});
export default skillsSlice.reducer;
