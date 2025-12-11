// Logic for Step 3: Payment Details and Images
export const step3InitialData = {
  advanceAmount: "",
  rentAmount: "",
<<<<<<< Updated upstream
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
=======
  images: [], // Array to store image URIs
};

export const handleImageSelect = (formData, setFormData) => (imageUri) => {
  console.log('Adding image URI:', imageUri);
  
  // Get current images array
  const currentImages = formData.images || [];
  
  // Check if we've reached the maximum number of images (7)
  if (currentImages.length >= 7) {
    console.log("Maximum number of images reached");
    Alert.alert('Error', 'You can only add up to 7 images.');
    return;
  }
  
  // Add the new image URI to the array
  const updatedImages = [...currentImages, imageUri];
  console.log('Updated images array:', updatedImages);
  
  // Update the form data
  setFormData({
    ...formData,
    images: updatedImages
>>>>>>> Stashed changes
  });
};

export const handleRemoveImage = (formData, setFormData) => (index) => {
<<<<<<< Updated upstream
  const newImages = [...formData.images];
  newImages.splice(index, 1);
  setFormData({
    ...formData,
    images: newImages
=======
  console.log('Removing image at index:', index);
  
  // Get current images array
  const currentImages = formData.images || [];
  
  // Remove the image at the specified index
  const updatedImages = currentImages.filter((_, i) => i !== index);
  console.log('Updated images array after removal:', updatedImages);
  
  // Update the form data
  setFormData({
    ...formData,
    images: updatedImages
>>>>>>> Stashed changes
  });
};