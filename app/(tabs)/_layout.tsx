import { HapticTab } from "@/components/haptic-tab";
import AddReminderButton from "@/components/home/AddReminderButton";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs, usePathname } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const isDark = colorScheme === "dark";
    const activeColor = isDark ? "#A78BFA" : "#4F46E5";
    const inactiveColor = isDark ? "#999" : "#666";

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: activeColor,
                    tabBarInactiveTintColor: inactiveColor,
                    headerShown: false,
                    tabBarStyle: {
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderTopWidth: 0,
                        elevation: 0,
                        backgroundColor: isDark
                            ? "rgba(20, 20, 20, 0.85)"
                            : "rgba(255, 255, 255, 0.85)",
                        height: 80,
                        paddingBottom: 25,
                    },
                    tabBarButton: HapticTab,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Trang chủ",
                        tabBarIcon: ({ color, focused }) => (
                            <IconSymbol
                                name={focused ? "house.fill" : "house"}
                                color={color}
                                size={24}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="time-alerts"
                    options={{
                        title: "Nhắc Giờ",
                        tabBarIcon: ({ color, focused }) => (
                            <IconSymbol
                                name={focused ? "clock.fill" : "clock"}
                                color={color}
                                size={24}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="item-checklist"
                    options={{
                        title: "Mang Đồ",
                        tabBarIcon: ({ color, focused }) => (
                            <IconSymbol
                                name={focused ? "backpack.fill" : "backpack"}
                                color={color}
                                size={24}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="location-alerts"
                    options={{
                        title: "Vị Trí",
                        tabBarIcon: ({ color, focused }) => (
                            <IconSymbol
                                name={
                                    focused
                                        ? "location.north.fill"
                                        : "location.north"
                                }
                                color={color}
                                size={24}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: "Lịch sử",
                        tabBarIcon: ({ color, focused }) => (
                            <IconSymbol
                                name={
                                    focused
                                        ? "list.bullet.rectangle.fill"
                                        : "list.bullet.rectangle"
                                }
                                color={color}
                                size={24}
                            />
                        ),
                    }}
                />
            </Tabs>
            {isHomePage && <AddReminderButton />}
        </View>
    );
}
