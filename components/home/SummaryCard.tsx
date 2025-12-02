import { ThemedText } from "@/components/themed-text";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type SummaryCardProps = {
    title: string;
    content: string;
    href: string;
    icon: React.ReactNode;
    gradient: string[];
};

export function SummaryCard({
    title,
    content,
    href,
    icon,
    gradient,
}: SummaryCardProps) {
    return (
        <Link href={href} asChild>
            <TouchableOpacity>
                <LinearGradient
                    colors={gradient}
                    style={styles.card}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.iconContainer}>{icon}</View>
                    <View style={styles.textContainer}>
                        <ThemedText style={styles.title}>{title}</ThemedText>
                        <ThemedText style={styles.content}>
                            {content}
                        </ThemedText>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 20,
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
        backgroundColor: "transparent",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    content: {
        fontSize: 14,
        color: "#FFFFFF",
        opacity: 0.8,
    },
});
