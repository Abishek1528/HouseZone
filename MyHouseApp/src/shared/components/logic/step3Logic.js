import { Alert } from "react-native";

// Step 3 Initial Data
export const step3InitialData = {
  advanceAmount: "",
  rentAmount: "",
  leaseAmount: "",
  images: [], // Array to store image URIs (max 7)
};

// ======================================================
// ✅ Add Image Function
// ======================================================
export const handleImageSelect = (formData, setFormData) => (imageUri) => {
  console.log("Adding image URI:", imageUri);

  const currentImages = formData.images || [];

  // Check limit
  if (currentImages.length >= 7) {
    Alert.alert("Error", "You can only add up to 7 images.");
    return;
  }

  // Add new image
  const updatedImages = [...currentImages, imageUri];
  console.log("Updated images:", updatedImages);

  setFormData({
    ...formData,
    images: updatedImages,
  });
};

// ======================================================
// ✅ Remove Image Function
// ======================================================
export const handleRemoveImage = (formData, setFormData) => (index) => {
  console.log("Removing image index:", index);

  const currentImages = formData.images || [];

  const updatedImages = currentImages.filter((_, i) => i !== index);

  console.log("Updated images after remove:", updatedImages);

  setFormData({
    ...formData,
    images: updatedImages,
  });
};
