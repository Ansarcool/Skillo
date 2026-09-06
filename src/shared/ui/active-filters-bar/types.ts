export type TFilterChip = {
  key: string;
  label: string;
};

export type TActiveFiltersBarUIProps = {
  chips: TFilterChip[];
  onRemoveChip: (key: string) => void;
  onResetAll: () => void;
};
