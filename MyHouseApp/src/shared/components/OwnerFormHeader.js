import React from "react";
import { View, Text } from "react-native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";

const OwnerFormHeader = ({ title, step, maxSteps, dark }) => {
  const ofs = getOwnerFormStyles({}, dark);

  return (
    <View style={ofs.headerSection}>
      <Text style={ofs.headerTitle}>{title}</Text>
      <Text style={ofs.headerSubtitle}>
        Fill in the details below to list your property
      </Text>

      <View style={ofs.stepProgressRow}>
        {Array.from({ length: maxSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === step;
          const isCompleted = stepNumber < step;

          return (
            <React.Fragment key={stepNumber}>
              <View style={ofs.stepNode}>
                <View
                  style={[
                    ofs.stepCircle,
                    isCompleted && ofs.stepCircleDone,
                    isActive && ofs.stepCircleActive,
                  ]}
                >
                  <Text
                    style={[
                      ofs.stepCircleText,
                      (isActive || isCompleted) && ofs.stepCircleTextActive,
                    ]}
                  >
                    {stepNumber}
                  </Text>
                </View>
                <Text
                  style={[
                    ofs.stepNodeLabel,
                    isActive && ofs.stepNodeLabelActive,
                    isCompleted && ofs.stepNodeLabelDone,
                  ]}
                >
                  Step {stepNumber}
                </Text>
              </View>

              {stepNumber < maxSteps ? (
                <View
                  style={[
                    ofs.stepConnector,
                    isCompleted && ofs.stepConnectorDone,
                  ]}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default OwnerFormHeader;
