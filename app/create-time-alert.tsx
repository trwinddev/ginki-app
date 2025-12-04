import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const DaySelector = ({
    selectedDays,
    onToggleDay,
}: {
    selectedDays: string[];
    onToggleDay: (day: string) => void;
}) => {
    const colorScheme = useColorScheme();
    const activeColor = colorScheme === "dark" ? "#A78BFA" : "#4F46E5";
    const dayTextColor = colorScheme === "dark" ? "#FFF" : "#000";
    const dayButtonBg = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";

    return (
        <View style={styles.daySelectorContainer}>
            {days.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                    <TouchableOpacity
                        key={day}
                        onPress={() => onToggleDay(day)}
                        style={[
                            styles.dayButton,
                            {
                                backgroundColor: isSelected
                                    ? activeColor
                                    : dayButtonBg,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.dayText,
                                { color: isSelected ? "#FFF" : dayTextColor },
                            ]}
                        >
                            {day}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default function CreateTimeAlertScreen() {
    const router = useRouter();
    const { alarm } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(Platform.OS === "ios");
    const [repeatDays, setRepeatDays] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [smartReminders, setSmartReminders] = useState({
        rain: false,
        flood: false,
        traffic: false,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [alarmId, setAlarmId] = useState(null);

    useEffect(() => {
        if (alarm && typeof alarm === "string") {
            try {
                const alarmData = JSON.parse(alarm);
                setIsEditing(true);
                setAlarmId(alarmData.id);
                setName(alarmData.name || "");
                setRepeatDays(alarmData.repeat || []);
                setSmartReminders({
                    rain: alarmData.smartModes?.rain || false,
                    flood: alarmData.smartModes?.flood || false,
                    traffic: alarmData.smartModes?.traffic || false,
                });
                if (alarmData.time) {
                    const [hours, minutes] = alarmData.time
                        .split(":")
                        .map(Number);
                    const alarmDate = new Date();
                    alarmDate.setHours(hours, minutes, 0, 0);
                    setTime(alarmDate);
                }
            } catch (e) {
                console.error("Failed to parse alarm data:", e);
            }
        }
    }, [alarm]);

    const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || time;
        if (Platform.OS === "android") {
            setShowTimePicker(false);
        }
        setTime(currentDate);
    };

    const toggleDay = (day: string) => {
        setRepeatDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSave = async () => {
        try {
            const existingAlarmsRaw = await AsyncStorage.getItem("alarms");
            const existingAlarms = existingAlarmsRaw
                ? JSON.parse(existingAlarmsRaw)
                : [];

            const alarmData = {
                name,
                time: time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                repeat: repeatDays,
                smartModes: smartReminders,
            };

            if (isEditing) {
                const updatedAlarms = existingAlarms.map((a) =>
                    a.id === alarmId ? { ...a, ...alarmData } : a
                );
                await AsyncStorage.setItem(
                    "alarms",
                    JSON.stringify(updatedAlarms)
                );
            } else {
                const newAlarm = {
                    ...alarmData,
                    id: Date.now().toString(),
                    isEnabled: true,
                };
                const newAlarms = [newAlarm, ...existingAlarms];
                await AsyncStorage.setItem("alarms", JSON.stringify(newAlarms));
            }

            router.back();
        } catch (e) {
            console.error("Failed to save alarm.", e);
        }
    };

    const backgroundColor = isDark ? "#000" : "#F2F2F7";
    const sectionColor = isDark ? "#1C1C1E" : "#FFF";
    const textColor = isDark ? "#FFF" : "#000";
    const separatorColor = isDark ? "#38383A" : "#C6C6C8";
    const activeColor = isDark ? "#A78BFA" : "#4F46E5";

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={[styles.headerButton, { color: activeColor }]}>
                        Huỷ
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>
                    {isEditing ? "Sửa báo thức" : "Báo thức mới"}
                </Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text
                        style={[
                            styles.headerButton,
                            { color: activeColor, fontWeight: "bold" },
                        ]}
                    >
                        Lưu
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={styles.timePickerContainer}>
                    {Platform.OS === "android" && (
                        <TouchableOpacity
                            onPress={() => setShowTimePicker(true)}
                            style={styles.timeDisplayAndroid}
                        >
                            <Text
                                style={[styles.timeText, { color: textColor }]}
                            >
                                {time.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            value={time}
                            mode="time"
                            is24Hour={true}
                            display="spinner"
                            onChange={onTimeChange}
                            textColor={textColor}
                        />
                    )}
                </View>

                <View
                    style={[styles.section, { backgroundColor: sectionColor }]}
                >
                    <View
                        style={[
                            styles.row,
                            { borderBottomColor: separatorColor },
                        ]}
                    >
                        <Text style={[styles.label, { color: textColor }]}>
                            Lặp lại
                        </Text>
                        <DaySelector
                            selectedDays={repeatDays}
                            onToggleDay={toggleDay}
                        />
                    </View>
                    <View style={[styles.row, styles.lastRow]}>
                        <Text style={[styles.label, { color: textColor }]}>
                            Tên báo thức
                        </Text>
                        <TextInput
                            style={[styles.input, { color: textColor }]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Đi làm, Uống thuốc,..."
                            placeholderTextColor={
                                isDark ? "#8E8E93" : "#C7C7CD"
                            }
                        />
                    </View>
                </View>

                <Text style={styles.sectionHeaderText}>
                    NHẮC SỚM THÔNG MINH
                </Text>
                <View
                    style={[styles.section, { backgroundColor: sectionColor }]}
                >
                    <View
                        style={[
                            styles.row,
                            { borderBottomColor: separatorColor },
                        ]}
                    >
                        <Text style={[styles.label, { color: textColor }]}>
                            Mưa lớn
                        </Text>
                        <Switch
                            value={smartReminders.rain}
                            onValueChange={(v) =>
                                setSmartReminders((s) => ({ ...s, rain: v }))
                            }
                        />
                    </View>
                    <View
                        style={[
                            styles.row,
                            { borderBottomColor: separatorColor },
                        ]}
                    >
                        <Text style={[styles.label, { color: textColor }]}>
                            Ngập
                        </Text>
                        <Switch
                            value={smartReminders.flood}
                            onValueChange={(v) =>
                                setSmartReminders((s) => ({ ...s, flood: v }))
                            }
                        />
                    </View>
                    <View style={[styles.row, styles.lastRow]}>
                        <Text style={[styles.label, { color: textColor }]}>
                            Giao thông tắc
                        </Text>
                        <Switch
                            value={smartReminders.traffic}
                            onValueChange={(v) =>
                                setSmartReminders((s) => ({ ...s, traffic: v }))
                            }
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    headerButton: { fontSize: 17 },
    headerTitle: { fontSize: 17, fontWeight: "600" },
    saveButton: { fontWeight: "bold" },
    timePickerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    timeDisplayAndroid: {
        alignItems: "center",
    },
    timeText: {
        fontSize: 48,
        fontWeight: "bold",
    },
    section: {
        marginHorizontal: 16,
        borderRadius: 10,
        overflow: "hidden",
    },
    sectionHeaderText: {
        fontSize: 13,
        color: "#6D6D72",
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 8,
        textTransform: "uppercase",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    label: { fontSize: 17 },
    input: { fontSize: 17, textAlign: "right", flex: 1, marginLeft: 16 },
    daySelectorContainer: { flexDirection: "row", gap: 8 },
    dayButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    dayText: { fontSize: 14, fontWeight: "500" },
});
