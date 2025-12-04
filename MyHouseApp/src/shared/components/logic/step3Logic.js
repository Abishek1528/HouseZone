// Logic for Step 3: Payment Details and Images
export const step3InitialData = {
  advanceAmount: "",
  rentAmount: "",
  images: [], // Array to hold image URIs (between 4 and 8 required)
};

export const handleImageSelect = (formData, setFormData) => (index) => {
  // In a real app, this would open the image picker
  // For now, we'll just simulate adding an image
  const newImages = [...formData.images];
  if (index < newImages.length) {
    // Replace existing image
    newImages[index] = "https://via.placeholder.com/150?text=Updated+" + (index + 1);
  } else {
    // Add new image
    newImages.push("https://via.placeholder.com/150?text=Image+" + (newImages.length + 1));
  }
  setFormData({
    ...formData,
    images: newImages
  });
};

export const handleRemoveImage = (formData, setFormData) => (index) => {
  const newImages = [...formData.images];
  newImages.splice(index, 1);
  setFormData({
    ...formData,
    images: newImages
  });
};