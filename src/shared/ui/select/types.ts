export type TOption = {
  value: string;
  label: string;
};

export type TSelectProps = {
  label: string;
  placeholder: string;
  value: string;
  options: TOption[];
  onChange: (value: string) => void;
};
