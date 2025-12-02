import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";

export default function LocationAlertsScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Nhắc Theo Vị Trí</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
