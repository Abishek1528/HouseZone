import React from "react";
import { View, Text } from "react-native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";

const OwnerFormCard = ({ title, subtitle, children, colors, dark }) => {
  const ofs = getOwnerFormStyles(colors, dark);

  return (
    <View style={ofs.mainCard}>
      {title ? (
        <View style={ofs.cardHeader}>
          <Text style={ofs.sectionTitle}>{title}</Text>
          {subtitle ? <Text style={ofs.sectionSubtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
};

export default OwnerFormCard;
