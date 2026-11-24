export type TMultiSelectOption = {
  value: string;
  label: string;
};

export type TMultiSelectProps = {
  label?: string;
  placeholder?: string;
  options: TMultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  maxVisibleTags?: number;
};
