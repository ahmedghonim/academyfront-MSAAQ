import React, { createRef, forwardRef, useId, useState } from "react";

import ReactSelect, { components } from "react-select";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import CreatableSelect from "react-select/creatable";
import { GroupBase } from "react-select/dist/declarations/src/types";
import { AsyncAdditionalProps } from "react-select/dist/declarations/src/useAsync";
import { CreatableAdditionalProps } from "react-select/dist/declarations/src/useCreatable";
import { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";

import { defaultStyles } from "@/components/select/styles";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { Icon } from "@msaaqcom/abjad";

export interface SelectProps<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends StateManagerProps<any, boolean, GroupBase<any>>,
    AsyncAdditionalProps<any, any>,
    CreatableAdditionalProps<any, any> {
  isCreatable?: boolean;
  isCompact?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  loadOptions?: (inputValue: string, callback: (options: Array<object>) => void) => void;
  hasDropdownIndicator?: boolean;
}

const SelectComponents = forwardRef(({ isCreatable, options, ...props }: SelectProps, ref) => {
  let Component: any = isCreatable
    ? props.loadOptions
      ? AsyncCreatableSelect
      : CreatableSelect
    : props.loadOptions
    ? AsyncSelect
    : ReactSelect;

  return (
    <Component
      ref={ref}
      options={options}
      defaultOptions={options || true}
      {...props}
    />
  );
});

const Select = forwardRef(
  (
    {
      name,
      value,
      isCreatable,
      isClearable = false,
      className,
      styles = defaultStyles,
      options,
      disabled = false,
      hasDropdownIndicator = true,
      loadOptions,
      ...props
    }: SelectProps,
    ref
  ) => {
    const localeRef = ref ?? createRef();
    const [timeoutState, setTimeoutState] = useState<number | any>(0);

    /**
     * This to avoid sending request to server on every keystroke
     *
     * @param inputValue
     * @param callback
     */
    const loadOptionsCallback = (inputValue: string, callback: (options: Array<object>) => void) => {
      if (timeoutState) {
        clearTimeout(timeoutState);
      }

      setTimeoutState(
        setTimeout(() => {
          loadOptions && loadOptions(inputValue, callback);
        }, 400)
      );
    };

    return (
      <SelectComponents
        isCreatable={isCreatable}
        classNamePrefix="select"
        name={name}
        value={value}
        isDisabled={disabled}
        menuPlacement="auto"
        styles={styles}
        isClearable={isClearable}
        noOptionsMessage={() => "لا يوجد نتائج"}
        loadingMessage={() => "جاري التحميل..."}
        formatCreateLabel={(inputValue: string) => "إنشاء " + `"${inputValue}"`}
        components={{
          DropdownIndicator: (props): any => {
            if (!hasDropdownIndicator) {
              return null;
            }

            return isClearable && props.hasValue
              ? ""
              : components.DropdownIndicator({
                  ...props,
                  children: (
                    <Icon
                      size="md"
                      children={<ChevronDownIcon />}
                    />
                  )
                });
          },
          MultiValueRemove: (props): any =>
            components.MultiValueRemove({
              ...props,
              children: (
                <Icon
                  children={<XMarkIcon />}
                  size="sm"
                />
              )
            }),
          ClearIndicator: (props): any =>
            components.ClearIndicator({
              ...props,
              children: <Icon children={<XMarkIcon />} />
            })
        }}
        cacheOptions
        loadOptions={loadOptions ? loadOptionsCallback : undefined}
        options={options}
        ref={localeRef}
        instanceId={useId()}
        {...props}
      />
    );
  }
);

export default Select;
