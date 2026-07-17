import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTenantPageStyles } from '../../styles/tenantPageStyles';

const SearchableDropdown = ({ 
  label, 
  options, 
  selectedValue, 
  onSelect, 
  placeholder = "Search..." 
}) => {
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const [searchText, setSearchText] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Sync search text with selected value
  useEffect(() => {
    if (selectedValue) {
      const selectedOption = options.find(option => option.value === selectedValue);
      if (selectedOption) {
        setSearchText(selectedOption.label);
      }
    } else {
      setSearchText('');
    }
  }, [selectedValue, options]);

  // Filter options based on search text
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle selecting an option
  const handleSelect = (option) => {
    onSelect(option.value);
    setSearchText(option.label);
    setIsDropdownVisible(false);
  };

  // Handle clearing the search
  const handleClear = () => {
    onSelect('');
    setSearchText('');
    setIsDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: tps.colors.text }]}>{label}</Text>}
      <View style={[styles.inputContainer, { borderColor: tps.colors.border }]}>
        <TextInput
          style={[styles.input, { color: tps.colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={tps.colors.subText}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            setIsDropdownVisible(true);
          }}
          onFocus={() => setIsDropdownVisible(true)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={[styles.clearButtonText, { color: tps.colors.subText }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isDropdownVisible && searchText.length > 0 && filteredOptions.length > 0 && (
        <View style={[styles.dropdown, { backgroundColor: dark ? '#2a2a2a' : '#fff', borderColor: tps.colors.border }]}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option, 
                  { 
                    backgroundColor: selectedValue === option.value 
                      ? tps.colors.primary + '20' 
                      : 'transparent' 
                  }
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text style={[styles.optionText, { color: tps.colors.text }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'relative',
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownScroll: {
    paddingVertical: 4,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 16,
  },
});

export default SearchableDropdown;
