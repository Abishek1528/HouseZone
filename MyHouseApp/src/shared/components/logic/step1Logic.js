// Logic for Step 1: Address Information
export const step1InitialData = {
  name: "",
  doorNo: "",
  street: "",
  pincode: "",
  area: "",
  city: "",
  contactNo: "",
};

export const handleStep1InputChange = (formData, setFormData, setErrors) => (field, value) => {
  setFormData({
    ...formData,
    [field]: value
  });
  if (setErrors) {
    setErrors(prev => ({
      ...prev,
      [field]: null
    }));
  }
};