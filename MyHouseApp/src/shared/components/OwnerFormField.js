import React, { useState } from "react";
import { TextInput } from "react-native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import OutlinedFieldShell from "./OutlinedFieldShell";

const OwnerFormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  colors,
  dark,
  multiline = false,
  editable = true,
  compact = false,
}) => {
  const ofs = getOwnerFormStyles(colors, dark);
  const [focused, setFocused] = useState(false);
  const hasValue = value != null && String(value).length > 0;
  const floated = focused || hasValue;

  return (
    <OutlinedFieldShell
      label={label}
      dark={dark}
      floated={floated}
      filled={hasValue}
      contentMode="input"
      compact={compact}
    >
      <TextInput
        style={[
          ofs.outlinedInput,
          compact && ofs.outlinedInputCompact,
          floated && ofs.outlinedInputActive,
          hasValue && ofs.outlinedInputFilled,
          multiline && ofs.outlinedInputMultiline,
          !editable && ofs.outlinedInputDisabled,
          styles.input,
          compact && styles.inputCompact,
        ]}
        placeholder={floated ? placeholder || "" : ""}
        placeholderTextColor={ofs.colors.placeholder}
        value={value ?? ""}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        textAlignVertical={multiline ? "top" : "center"}
        underlineColorAndroid="transparent"
      />
    </OutlinedFieldShell>
  );
};

const styles = {
  input: {
    width: "100%",
    minHeight: 32,
    paddingVertical: 4,
  },
  inputCompact: {
    minHeight: 28,
    paddingVertical: 2,
  },
};

export default OwnerFormField;
