import {
  TouchableOpacity,
  StyleSheet,
  type TouchableOpacityProps,
} from "react-native";

import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

type ThemedButtonProps = TouchableOpacityProps & {
  type?: "default" | "primary" | "secondary" | "round" | "error";
};

export function ThemedButton({
  type = "default",
  style,
  children,
  ...rest
}: ThemedButtonProps) {
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
    backgroundColor: "#fff",
    color: "#000",
  },
  primary: {
    backgroundColor: "#AE7531",
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#15803D",
    color: "#fff",
  },
  error: {
    backgroundColor: Colors.red,
    color: "#fff",
  },
  round: {
    backgroundColor: "#AE7531",
    padding: 20,
    borderRadius: 30,
    color: "#fff",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
  },
  defaultText: {
    color: "#000",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#fff",
  },
  roundText: {
    color: "#fff",
  },
});
