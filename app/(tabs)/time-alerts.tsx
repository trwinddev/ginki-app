import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import {
    Animated,
    FlatList,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_ALARMS = [
    {
        id: "1",
        name: "Đi làm",
        time: "06:30",
        isEnabled: true,
        repeat: ["T2", "T3", "T4", "T5", "T6"],
        smartModes: { weather: true, traffic: true, eta: false },
    },
    {
        id: "2",
        name: "Uống thuốc",
        time: "14:00",
        isEnabled: false,
        repeat: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        smartModes: { weather: false, traffic: false, eta: false },
    },
    {
        id: "3",
        name: "Tập gym",
        time: "20:00",
        isEnabled: true,
        repeat: [],
        smartModes: { weather: false, traffic: false, eta: false },
    },
];

type Alarm = (typeof MOCK_ALARMS)[0];

const formatSubtitle = (item: Alarm) => {
    const repeatText =
        item.repeat.length === 7
            ? "Hàng ngày"
            : item.repeat.length > 0
            ? `Lặp lại: ${item.repeat.join(", ")}`
            : "Không lặp lại";

    const smartModes = Object.entries(item.smartModes)
        .filter(([, value]) => value)
        .map(([key]) => {
            if (key === "weather") return "thời tiết";
            if (key === "traffic") return "giao thông";
            if (key === "eta") return "ETA";
        })
        .join(" + ");

    if (smartModes) {
        return `Smart: ${smartModes}`;
    }
    return repeatText;
};

type AlarmItemProps = {
    alarm: Alarm;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (alarm: Alarm) => void;
};

const AlarmItem = ({ alarm, onToggle, onDelete, onEdit }: AlarmItemProps) => {
    const theme = useColorScheme() ?? "light";
    const subtitle = formatSubtitle(alarm);
    const textColor = Colors[theme].text;
    const subtitleColor = Colors[theme].text;
    const swipeableRef = React.useRef<Swipeable>(null);
    const itemBackgroundColor =
        theme === "light" ? "white" : "rgba(255, 255, 255, 0.1)";

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        return (
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                    swipeableRef.current?.close();
                    onDelete(alarm.id);
                }}
            >
                <ThemedText style={styles.deleteButtonText}>Xoá</ThemedText>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={() => onDelete(alarm.id)}
            rightThreshold={80}
            containerStyle={styles.swipeableContainer}
        >
            <TouchableOpacity onPress={() => onEdit(alarm)} activeOpacity={1}>
                <ThemedView
                    style={[
                        styles.itemContainer,
                        {
                            backgroundColor: itemBackgroundColor,
                            opacity: alarm.isEnabled ? 1 : 0.5,
                        },
                    ]}
                >
                    <View style={styles.itemDetails}>
                        <Text style={[styles.itemTime, { color: textColor }]}>
                            {alarm.time}
                        </Text>
                        <Text style={[styles.itemName, { color: textColor }]}>
                            {alarm.name}
                        </Text>
                        <Text
                            style={[
                                styles.itemSubtitle,
                                { color: subtitleColor },
                            ]}
                        >
                            {subtitle}
                        </Text>
                    </View>
                    <Switch
                        onValueChange={() => onToggle(alarm.id)}
                        value={alarm.isEnabled}
                    />
                </ThemedView>
            </TouchableOpacity>
        </Swipeable>
    );
};

export default function TimeAlertsScreen() {
    const theme = useColorScheme() ?? "light";
    const [alarms, setAlarms] = React.useState<Alarm[]>([]);
    const router = useRouter();
    const iconColor = Colors[theme].tint;

    const backgroundGradient =
        theme === "light" ? ["#f7faff", "#e6ecff"] : ["#151718", "#252A34"];

    const loadAlarms = React.useCallback(async () => {
        try {
            const alarmsRaw = await AsyncStorage.getItem("alarms");
            if (alarmsRaw) {
                setAlarms(JSON.parse(alarmsRaw));
            } else {
                setAlarms(MOCK_ALARMS);
                await AsyncStorage.setItem(
                    "alarms",
                    JSON.stringify(MOCK_ALARMS)
                );
            }
        } catch (e) {
            console.error("Failed to load alarms.", e);
            setAlarms(MOCK_ALARMS);
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadAlarms();
        }, [loadAlarms])
    );

    const toggleAlarm = async (id: string) => {
        try {
            const updatedAlarms = alarms.map((alarm) => {
                if (alarm.id === id) {
                    return { ...alarm, isEnabled: !alarm.isEnabled };
                }
                return alarm;
            });
            setAlarms(updatedAlarms);
            await AsyncStorage.setItem("alarms", JSON.stringify(updatedAlarms));
        } catch (e) {
            console.error("Failed to toggle alarm state.", e);
        }
    };

    const deleteAlarm = async (id: string) => {
        try {
            const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
            setAlarms(updatedAlarms);
            await AsyncStorage.setItem("alarms", JSON.stringify(updatedAlarms));
        } catch (e) {
            console.error("Failed to delete alarm.", e);
        }
    };

    const editAlarm = (alarm: Alarm) => {
        router.push({
            pathname: "/create-time-alert",
            params: { alarm: JSON.stringify(alarm) },
        });
    };

    const navigateToCreate = () => {
        router.push("/create-time-alert");
    };

    return (
        <LinearGradient colors={backgroundGradient} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <ThemedText type="title">Nhắc giờ</ThemedText>
                    <TouchableOpacity onPress={navigateToCreate}>
                        <IconSymbol name="plus" size={28} color={iconColor} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={alarms}
                    renderItem={({ item }) => (
                        <AlarmItem
                            alarm={item}
                            onToggle={toggleAlarm}
                            onDelete={deleteAlarm}
                            onEdit={editAlarm}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    swipeableContainer: {
        marginBottom: 12,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    itemDetails: {
        flex: 1,
        gap: 4,
    },
    itemTime: {
        fontSize: 28,
        fontWeight: "bold",
    },
    itemName: {
        fontSize: 18,
        fontWeight: "600",
    },
    itemSubtitle: {
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderRadius: 12,
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});
