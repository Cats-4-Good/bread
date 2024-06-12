import React from "react";
import { TouchableOpacity, Text, StyleSheet, type TouchableOpacityProps, type TextProps } from "react-native";
import { Colors } from "@/constants/Colors";

type ThemedButtonProps = TouchableOpacityProps & {
  type?: "default" | "primary" | "secondary" | "link";
  textProps?: TextProps;
  text?: string;
};

export function ThemedButton({ type = "default", style, text, textProps, children, ...rest }: ThemedButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === "default" ? styles.default : undefined,
        type === "primary" ? styles.primary : undefined,
        type === "secondary" ? styles.secondary : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    >
      {text ? (
        <Text
          style={[
            styles.buttonText,
            type === "default" ? styles.defaultText : undefined,
            type === "primary" ? styles.primaryText : undefined,
            type === "secondary" ? styles.secondaryText : undefined,
            type === "link" ? styles.linkText : undefined,
          ]}
          {...textProps}
        >
          {text}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 9,
    paddingHorizontal: 5,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  default: {
    backgroundColor: "white",
    color: "black",
  },
  primary: {
    backgroundColor: "#AE7531",
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#15803D",
    color: "#fff",
  },
  link: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    color: "white",
  },
  defaultText: {
    color: "#000",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: "white",
  },
  linkText: {
    color: "#0a7ea4",
  },
});
