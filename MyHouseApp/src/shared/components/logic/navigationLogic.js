// Navigation logic for the multi-step form
export const handleNext = (step, setStep, handleSubmit) => {
  if (step < 3) {
    setStep(step + 1);
  } else {
    handleSubmit();
  }
};

export const handlePrevious = (step, setStep) => {
  if (step > 1) {
    setStep(step - 1);
  }
};