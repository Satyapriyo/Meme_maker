import { Pressable, Text, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function IconButtons({ icon, label, onPress }) {
  return (
    <Pressable style={StyleSheet.iconButton} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color="#fff" />
      <Text style={styles.iconButtonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignContent: "center",
  },
  iconButtonLabel: {
    color: "#fff",
    marginTop: 12,
  },
});
