import { SummaryCard } from "@/components/home/SummaryCard";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng,";
    if (hour < 18) return "Một buổi chiều tốt lành,";
    return "Buổi tối vui vẻ,";
};

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const greeting = getGreeting();
    const backgroundGradient =
        colorScheme === "light"
            ? ["#f7faff", "#e6ecff"]
            : ["#151718", "#252A34"];

    return (
        <LinearGradient colors={backgroundGradient} style={styles.container}>
            <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <SafeAreaView>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTextContainer}>
                            <ThemedText style={styles.greeting}>
                                {greeting}
                            </ThemedText>
                            <ThemedText
                                style={styles.userName}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                adjustsFontSizeToFit
                            >
                                Phong
                            </ThemedText>
                        </View>
                        <Link href="/settings" asChild>
                            <View style={styles.settingsButton}>
                                <IconSymbol
                                    name="gearshape.fill"
                                    size={24}
                                    color={
                                        colorScheme === "light"
                                            ? "#333"
                                            : "#EEE"
                                    }
                                />
                            </View>
                        </Link>
                    </View>

                    {/* Main Content */}
                    <View style={styles.content}>
                        <SummaryCard
                            title="Nhắc giờ"
                            content="Tiếp theo: 06:30 - Đi làm"
                            href="/(tabs)/time-alerts"
                            icon={
                                <IconSymbol
                                    name="alarm.fill"
                                    size={32}
                                    color="white"
                                />
                            }
                            gradient={["#4A90E2", "#007AFF"]}
                        />
                        <SummaryCard
                            title="Nhắc mang đồ"
                            content="Đang bật: 3 món"
                            href="/(tabs)/item-checklist"
                            icon={
                                <IconSymbol
                                    name="backpack.fill"
                                    size={32}
                                    color="white"
                                />
                            }
                            gradient={["#F5A623", "#FFC107"]}
                        />
                        <SummaryCard
                            title="Nhắc theo vị trí"
                            content="Sắp đến: Công ty"
                            href="/(tabs)/location-alerts"
                            icon={
                                <IconSymbol
                                    name="location.north.fill"
                                    size={32}
                                    color="white"
                                />
                            }
                            gradient={["#50E3C2", "#48C6B9"]}
                        />
                    </View>
                </SafeAreaView>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: 120,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 20,
    },
    headerTextContainer: {
        flex: 1,
        marginRight: 16,
        flexShrink: 1,
    },
    greeting: {
        fontSize: 18,
        opacity: 0.7,
    },
    userName: {
        fontSize: 32,
        fontWeight: "bold",
        lineHeight: 36,
    },
    settingsButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: "rgba(128, 128, 128, 0.1)",
    },
    content: {
        paddingHorizontal: 24,
    },
});
