import axios from "axios";
import {
    create
} from "zustand";
import {
    mountStoreDevtool
} from "simple-zustand-devtools";

const baseUrl = `${process.env.REACT_APP_API_URL}/notifications`;

function calculateUnreadNotifications(notifications) {
    const total = notifications.data.reduce((acc, item) => {
        return acc + !item.read
    }, 0)
    return total
}

const useNotificationStore = create((set, get) => ({
    loading: false,
    error: null,
    notifications: [],
    unreadNotificationsCount: 0,

    fetchNotifications: async (getAccessTokenSilently) => {
        try {
            set(() => ({
                loading: true,
            }));

            set(() => ({
                error: null,
            }));

            const token = await getAccessTokenSilently();

            const response = await axios(`${baseUrl}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const notifications = response.data;

            notifications.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

            set(() => ({
                notifications,
                unreadNotificationsCount: calculateUnreadNotifications(notifications),
            }));

        } catch (error) {
            set({
                error
            });
        } finally {
            set({
                loading: false
            });
        }
    },

    markAsRead: async (id, getAccessTokenSilently) => {
        try {
            set(() => ({
                error: null,
            }));
            const token = await getAccessTokenSilently();

            await axios.put(
                `${baseUrl}/${id}`, {
                    toggleReadStatus: true
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            set(() => ({
                unreadNotificationsCount: get().unreadNotificationsCount - 1,
            }));
        } catch (error) {
            set({
                error
            });
        }



    }

}));

export default useNotificationStore;

if (process.env.NODE_ENV === "development") {
    mountStoreDevtool("NotificationStore", useNotificationStore);
}