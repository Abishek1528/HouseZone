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

  const currentImages = Array.isArray(formData.images) ? formData.images : [];
  if (!Array.isArray(formData.images) && formData.images !== undefined) {
    console.error("Invalid images state while adding image", {
      images: formData.images,
      receivedType: typeof formData.images,
      imageUri
    });
  }

  // Check limit
  if (currentImages.length >= 7) {
    Alert.alert("Error", "You can only add up to 7 images.");
    return;
  }

  // Add new image
  if (!imageUri || typeof imageUri !== "string") {
    console.error("Skipped invalid image URI", { imageUri });
    return;
  }

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

  const currentImages = Array.isArray(formData.images) ? formData.images : [];
  if (!Array.isArray(formData.images) && formData.images !== undefined) {
    console.error("Invalid images state while removing image", {
      images: formData.images,
      receivedType: typeof formData.images,
      index
    });
  }

  const updatedImages = currentImages.filter((_, i) => i !== index);

  console.log("Updated images after remove:", updatedImages);

  setFormData({
    ...formData,
    images: updatedImages,
  });
};
