import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { supabase } from "@/lib/supabase";
import * as Notifications from "expo-notifications";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
  }),
});

export default function NotificationProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const hasRegistered = useRef(false); // 🔥 prevents infinite loop

  // Run push-token registration once
  useEffect(() => {
    if (hasRegistered.current) return; // Already ran
    hasRegistered.current = true;

    registerForPushNotificationsAsync()
      .then(async (token) => {
        if (!token || token === expoPushToken) return;

        setExpoPushToken(token);

        // if (profile?.id) {
        //   await supabase
        //     .from("profiles")
        //     .update({ expo_push_token: token })
        //     .eq("id", profile.id);
        // }
        if (profile?.id && profile.expo_push_token !== token) {
          await supabase
            .from("profiles")
            .update({ expo_push_token: token })
            .eq("id", profile.id);
        }

      })
      .catch((e) => console.warn("Push registration error:", e));

    const notificationListener =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("notification", notification);
      });

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [profile?.id]); // only rerun if profile actually loads

  return <>{children}</>;
}

