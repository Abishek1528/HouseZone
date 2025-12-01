import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dummyStyles from '../styles/dummyStyles';

export default function Dummy() {
  const navigation = useNavigation();

  return (
    <View style={dummyStyles.container}>
      <Text style={dummyStyles.title}>Welcome to HouseZone</Text>

      <TouchableOpacity
        style={dummyStyles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={dummyStyles.btnText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}