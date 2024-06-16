import { TouchableOpacity, StyleSheet, type TouchableOpacityProps } from "react-native";

import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

type ThemedButtonProps = TouchableOpacityProps & {
  type?: "default" | "primary" | "secondary" | "round" | "error";
};

export function ThemedButton({ type = "default", style, children, ...rest }: ThemedButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === "default" ? styles.default : undefined,
        type === "primary" ? styles.primary : undefined,
        type === "secondary" ? styles.secondary : undefined,
        type === "round" ? styles.round : undefined,
        type === "error" ? styles.error : undefined,
        style,
      ]}
      {...rest}
    >
      <ThemedText style={styles.buttonText} type="default">
        {children}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  default: {
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  primary: {
    backgroundColor: Colors.accent,
    color: Colors.white,
  },
  secondary: {
    backgroundColor: Colors.greenDark,
    color: Colors.white,
  },
  error: {
    backgroundColor: Colors.red,
    color: Colors.white,
  },
  round: {
    backgroundColor: Colors.accent,
    padding: 20,
    borderRadius: 30,
    color: Colors.white,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.white,
  },
  defaultText: {
    color: Colors.black,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  roundText: {
    color: Colors.white,
  },
});
