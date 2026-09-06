import { describe, it, expect } from 'vitest';
import filterReducer, {
  toggleSubcategory,
  toggleCategoryGroup,
  setLearningMode,
  setGender,
  toggleCity,
  setSearch,
  resetFilters,
  type TFilterState
} from '../filterSlice';

describe('filterSlice', () => {
  const initialState: TFilterState = {
    selectedSubcategoryIds: [],
    learningMode: 'all',
    gender: 'any',
    selectedCityIds: [],
    search: ''
  };

  describe('toggleSubcategory', () => {
    it('должен добавить id, если его ещё нет в списке', () => {
      const state = filterReducer(initialState, toggleSubcategory('Гитара'));

      expect(state.selectedSubcategoryIds).toEqual(['Гитара']);
    });

    it('должен убрать id, если он уже есть в списке', () => {
      const stateWithSelection: TFilterState = {
        ...initialState,
        selectedSubcategoryIds: ['Гитара', 'Английский']
      };

      const state = filterReducer(
        stateWithSelection,
        toggleSubcategory('Гитара')
      );

      expect(state.selectedSubcategoryIds).toEqual(['Английский']);
    });
  });

  describe('toggleCategoryGroup', () => {
    it('selectAll: true - должен добавить все id категории, не дублируя уже выбранные', () => {
      const stateWithSelection: TFilterState = {
        ...initialState,
        selectedSubcategoryIds: ['Гитара']
      };

      const state = filterReducer(
        stateWithSelection,
        toggleCategoryGroup({
          subcategoryIds: ['Гитара', 'Пианино', 'Вокал'],
          selectAll: true
        })
      );

      expect(state.selectedSubcategoryIds).toEqual([
        'Гитара',
        'Пианино',
        'Вокал'
      ]);
    });
    it('selectAll: false - должен убрать все id категории из списка выбранных', () => {
      const stateWithSelection: TFilterState = {
        ...initialState,
        selectedSubcategoryIds: ['Гитара', 'Пианино', 'Английский']
      };

      const state = filterReducer(
        stateWithSelection,
        toggleCategoryGroup({
          subcategoryIds: ['Гитара', 'Пианино'],
          selectAll: false
        })
      );

      expect(state.selectedSubcategoryIds).toEqual(['Английский']);
    });
    it('selectAll: true на пустом состоянии - должен просто добавить переданные id', () => {
      const state = filterReducer(
        initialState,
        toggleCategoryGroup({
          subcategoryIds: ['Гитара', 'Пианино'],
          selectAll: true
        })
      );

      expect(state.selectedSubcategoryIds).toEqual(['Гитара', 'Пианино']);
    });
  });

  describe('setLearningMode', () => {
    it('должен установить learningMode : "wantToLearn"', () => {
      const state = filterReducer(initialState, setLearningMode('wantToLearn'));

      expect(state.learningMode).toEqual('wantToLearn');
    });
    it('должен установить learningMode : "canTeach"', () => {
      const state = filterReducer(initialState, setLearningMode('canTeach'));

      expect(state.learningMode).toEqual('canTeach');
    });
    it('должен установить learningMode : "all"', () => {
      const state = filterReducer(initialState, setLearningMode('all'));

      expect(state.learningMode).toEqual('all');
    });
  });
  describe('setGender', () => {
    it('должен установить gender : "male"', () => {
      const state = filterReducer(initialState, setGender('male'));

      expect(state.gender).toEqual('male');
    });
    it('должен установить gender : "female"', () => {
      const state = filterReducer(initialState, setGender('female'));

      expect(state.gender).toEqual('female');
    });
    it('должен установить gender : "male"', () => {
      const state = filterReducer(initialState, setGender('any'));

      expect(state.gender).toEqual('any');
    });
  });
  describe('toggleCity', () => {
    it('должен добавить город, если его ещё нет в списке', () => {
      const state = filterReducer(initialState, toggleCity('Лондон'));

      expect(state.selectedCityIds).toEqual(['Лондон']);
    });
    it('если id есть в списке то должен удалить', () => {
      const stateWithSelection: TFilterState = {
        ...initialState,
        selectedCityIds: ['Роттердам', 'Талин', 'Лондон']
      };
      const state = filterReducer(stateWithSelection, toggleCity('Лондон'));

      expect(state.selectedCityIds).toEqual(['Роттердам', 'Талин']);
    });
  });
  describe('setSearch', () => {
    it('должен установить строку поиска', () => {
      const state = filterReducer(initialState, setSearch('гитара'));

      expect(state.search).toEqual('гитара');
    });

    it('должен очистить строку поиска пустой строкой', () => {
      const stateWithSearch: TFilterState = {
        ...initialState,
        search: 'гитара'
      };

      const state = filterReducer(stateWithSearch, setSearch(''));

      expect(state.search).toEqual('');
    });
  });
  describe('resetFilters', () => {
    it('должен сбросить все фильтры к initialState', () => {
      const dirtyState: TFilterState = {
        selectedSubcategoryIds: ['Гитара'],
        learningMode: 'canTeach',
        gender: 'male',
        selectedCityIds: ['Лондон'],
        search: 'тест'
      };

      const state = filterReducer(dirtyState, resetFilters());

      expect(state).toEqual(initialState);
    });
  });
});
