import React from "react";
import OptionButtonGroup from "./OptionButtonGroup";
import CollapsibleFieldShell from "./CollapsibleFieldShell";

const OptionSelectField = ({
  label,
  options,
  selectedValue,
  onSelect,
  colors,
  dark = false,
  compact = false,
  collapsible = false,
}) => {
  if (!label) {
    return (
      <OptionButtonGroup
        options={options}
        selectedValue={selectedValue}
        onSelect={onSelect}
        colors={colors}
        compact={compact}
      />
    );
  }

  const hasSelection =
    selectedValue !== undefined &&
    selectedValue !== null &&
    String(selectedValue).length > 0;
  const selectedOption = options.find((o) => o.value === selectedValue);
  const summary = hasSelection ? selectedOption?.label : null;

  return (
    <CollapsibleFieldShell
      label={label}
      dark={dark}
      filled={hasSelection}
      summary={summary}
      collapsible={collapsible}
      fieldType="options"
    >
      {({ collapse }) => (
        <OptionButtonGroup
          options={options}
          selectedValue={selectedValue}
          onSelect={(value) => {
            onSelect(value);
            if (collapsible) collapse();
          }}
          colors={colors}
          compact={compact}
          singleRow={options.length === 4}
        />
      )}
    </CollapsibleFieldShell>
  );
};

export default OptionSelectField;
