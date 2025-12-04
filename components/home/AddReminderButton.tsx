import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";

const options = [
    {
        icon: "clock.fill",
        label: "Nhắc giờ",
        colors: ["#00BFFF", "#1E90FF"],
        screen: "/time-alerts",
    },
    {
        icon: "backpack.fill",
        label: "Nhắc mang đồ",
        colors: ["#FF5733", "#FF8C00"],
        screen: "/item-checklist",
    },
    {
        icon: "location.north.fill",
        label: "Nhắc theo vị trí",
        colors: ["#6D5FFD", "#A855F7"],
        screen: "/location-alerts",
    },
];

export default function AddReminderButton() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            friction: 7,
            tension: 60,
            useNativeDriver: true,
        }).start();
        setIsOpen(!isOpen);
    };

    const handleOptionPress = (screen: string) => {
        toggleMenu();
        router.push(screen);
    };

    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"],
    });

    const optionsContainerAnimation = {
        opacity: animation,
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                }),
            },
            {
                scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                }),
            },
        ],
    };

    return (
        <>
            {isOpen && (
                <Pressable style={styles.overlay} onPress={toggleMenu} />
            )}
            <View style={styles.container} pointerEvents="box-none">
                {isOpen && (
                    <Animated.View
                        style={[
                            styles.optionsWrapper,
                            optionsContainerAnimation,
                        ]}
                        pointerEvents="auto"
                    >
                        {options.map((option) => (
                            <Pressable
                                key={option.label}
                                style={styles.optionRow}
                                onPress={() => handleOptionPress(option.screen)}
                            >
                                <LinearGradient
                                    colors={option.colors}
                                    style={styles.optionButton}
                                >
                                    <IconSymbol
                                        name={option.icon}
                                        size={24}
                                        color="#fff"
                                    />
                                </LinearGradient>
                                <Text style={styles.optionLabel}>
                                    {option.label}
                                </Text>
                            </Pressable>
                        ))}
                    </Animated.View>
                )}

                <Pressable onPress={toggleMenu} pointerEvents="auto">
                    <Animated.View
                        style={[
                            styles.button,
                            { transform: [{ rotate: rotation }] },
                        ]}
                    >
                        <LinearGradient
                            colors={["#6D5FFD", "#A855F7"]}
                            style={styles.gradient}
                        >
                            <Ionicons name="add" size={32} color="#fff" />
                        </LinearGradient>
                    </Animated.View>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10,
    },
    container: {
        position: "absolute",
        bottom: 90,
        right: 24,
        alignItems: "flex-end",
        zIndex: 11,
    },
    optionsWrapper: {
        marginBottom: 20,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        gap: 16,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: 220,
        gap: 16,
    },
    optionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    optionLabel: {
        color: "#333",
        fontWeight: "600",
        fontSize: 16,
    },
    button: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    gradient: {
        width: "100%",
        height: "100%",
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
    },
});
