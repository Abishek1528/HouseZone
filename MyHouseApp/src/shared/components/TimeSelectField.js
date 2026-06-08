import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CollapsibleFieldShell from "./CollapsibleFieldShell";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";

const defaultMorning = () => {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  return d;
};

export const formatTime12h = (date) => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const parseTimeString = (str) => {
  if (!str) return defaultMorning();
  const parsed = Date.parse(`1970/01/01 ${str}`);
  if (!Number.isNaN(parsed)) return new Date(parsed);
  return defaultMorning();
};

const TimeSelectField = ({ label, value, onChange, colors, dark }) => {
  const ofs = getOwnerFormStyles(colors, dark);
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");
  const [pickerDate, setPickerDate] = useState(() => parseTimeString(value));

  useEffect(() => {
    setPickerDate(parseTimeString(value));
  }, [value]);

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event?.type === "dismissed") return;
    }

    const next = selectedDate || pickerDate;
    setPickerDate(next);
    onChange(formatTime12h(next));
  };

  return (
    <CollapsibleFieldShell
      label={label}
      dark={dark}
      filled={!!value}
      summary={value || null}
      collapsible
      fieldType="options"
    >
      {() => (
        <View>
          {Platform.OS === "android" ? (
            <TouchableOpacity
              style={ofs.buttonPrimary}
              onPress={() => setShowPicker(true)}
            >
              <Text style={ofs.buttonText}>
                {value ? `Change time (${value})` : "Select time on clock"}
              </Text>
            </TouchableOpacity>
          ) : null}

          {(showPicker || Platform.OS === "ios") && (
            <DateTimePicker
              value={pickerDate}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "clock"}
              onChange={handleChange}
            />
          )}

          {value ? (
            <Text style={[ofs.subtitle, { textAlign: "left", marginTop: 8 }]}>
              Selected: {value}
            </Text>
          ) : null}
        </View>
      )}
    </CollapsibleFieldShell>
  );
};

export default TimeSelectField;
