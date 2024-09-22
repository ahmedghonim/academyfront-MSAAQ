import { CSSObjectWithLabel, ControlProps } from "react-select";
import { StylesProps } from "react-select/dist/declarations/src/styles";
import { GroupBase } from "react-select/dist/declarations/src/types";
import resolveConfig from "tailwindcss/resolveConfig";

//@ts-ignore
import tailwindConfig from "@/tailwind.config.js";

const { theme }: any = resolveConfig(tailwindConfig);

export declare type StylesConfig<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
> = {
  [K in keyof StylesProps<Option, IsMulti, Group>]?: (
    base: CSSObjectWithLabel,
    props: StylesProps<Option, IsMulti, Group>[K]
  ) => CSSObjectWithLabel;
};

export const defaultStyles: StylesConfig<unknown, true> | any = {
  container: (base: CSSObjectWithLabel, props: ControlProps<unknown, true>) => ({
    ...base,
    width: "100%"
  }),
  control: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    // @ts-ignore
    minHeight: 48,
    //@ts-ignore
    borderRadius: state.selectProps?.rounded ? theme.borderRadius.full : theme.borderRadius.md,
    borderColor: state.isDisabled
      ? `hsl(var(--abjad-gray))`
      : state.isFocused
      ? `transparent`
      : `hsl(var(--abjad-gray))`,

    boxShadow: state.isFocused ? `0 0 0 2px hsl(var(--abjad-primary-300)) , 0 0 #0000` : "none",
    "&:hover": {
      borderColor: !state.isFocused ? `hsl(var(--abjad-gray-600))` : ""
    },
    "&:focus": {
      borderColor: `0 0 0 2px hsl(var(--abjad-primary-300)) , 0 0 #0000`
    }
  }),
  placeholder: (provided: CSSObjectWithLabel) => ({
    ...provided,
    fontSize: 14,
    color: "#C7C7C7",
    fontWeight: 400
  }),
  valueContainer: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    paddingInlineStart: ".75rem"
  }),
  menu: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    zIndex: "9999999",
    borderRadius: theme.borderRadius.md,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${theme.colors.gray[300]}`,
    borderColor: state.isDisabled
      ? theme.colors.gray[600]
      : state.isFocused
      ? "var(--bs-primary)"
      : theme.colors.gray["DEFAULT"]
  }),
  menuList: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    padding: 8,
    display: "flex",
    flexDirection: "column",
    gap: 4
  }),
  option: (provided: CSSObjectWithLabel, state: ControlProps | any) => ({
    ...provided,
    fontSize: 14,
    borderRadius: theme.borderRadius.md,
    color: state.isSelected ? "hsl(var(--abjad-primary))" : `hsl(var(--abjad-gray-950))`,
    backgroundColor: state.isSelected ? `hsl(var(--abjad-primary)/0.1)` : "transparent",
    "&:active": {
      backgroundColor: state.isSelected ? `hsl(var(--abjad-primary)/0.1)` : "transparent"
    },
    "&:hover": {
      color: "hsl(var(--abjad-primary))",
      backgroundColor: `hsl(var(--abjad-primary)/0.1)`
    }
  }),
  multiValue: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    borderRadius: "0.25rem",
    overflow: "hidden",
    backgroundColor: theme.colors.gray[200],

    "&:first-of-type": {
      marginInlineStart: 0
    }
  }),
  multiValueLabel: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    paddingInlineStart: 8,
    backgroundColor: theme.colors.gray[200]
  }),
  multiValueRemove: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    borderRadius: 0,
    backgroundColor: theme.colors.gray[200],
    "&:hover": {
      backgroundColor: "red",
      color: "white"
    }
  }),
  indicatorSeparator: () => ({
    display: "none"
  }),
  dropdownIndicator: (provided: CSSObjectWithLabel) => ({
    ...provided,
    cursor: "pointer",
    paddingInlineEnd: ".75rem"
  }),
  clearIndicator: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    cursor: "pointer",
    paddingInlineEnd: "var(--ms-form-control-padding-x)"
  }),
  loadingIndicator: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    cursor: "progress",
    paddingInlineEnd: state.hasValue ? "var(--ms-form-control-padding-x)" : ""
  })
};

export const abstract = {
  multiValueLabel: defaultStyles.multiValueLabel,
  control: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    border: 0,
    boxShadow: "none",
    "&:hover": {
      border: 0
    }
  }),
  menu: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    zIndex: "99999"
  }),
  option: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided
    // textAlign: 'left'
  }),
  indicatorSeparator: (provided: CSSObjectWithLabel, state: ControlProps) => ({})
};

export const multi = {
  ...defaultStyles,
  multiValue: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    margin: 0
  }),
  multiValueLabel: defaultStyles.multiValueLabel,
  input: (provided: CSSObjectWithLabel, state: ControlProps) => ({
    ...provided,
    width: "100%"
  })
};
