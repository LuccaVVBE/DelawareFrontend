import axios, {
    isAxiosError
} from "axios";
import {
    create
} from "zustand";
import {
    mountStoreDevtool
} from 'simple-zustand-devtools';


const useTrackingStore = create((set) => ({
    loading: false,
    error: null,
    trackingStatus: null,

    fetchTrackingStatus: async (trackingNumber, confirmationNumber) => {
        set(() => ({
            loading: true,
            error: null
        }));

        try {
            if (!trackingNumber || !confirmationNumber) {
                throw new Error("Tracking number and confirmation number are required");
            }


            const response = await axios.get(`http://localhost:9000/track`, {
                params: {
                    trackingNumber: trackingNumber,
                    confirmationNumber: confirmationNumber
                }
            });

            set(() => ({
                trackingStatus: response.data
            }));
            set(() => ({
                error: null
            }));

        } catch (err) {
            if (isAxiosError(err)) {
                set(() => ({
                    error: err.response.data
                }))
            } else {
                set(() => ({
                    error: err
                }));
            }
        }

        set(() => ({
            loading: false
        }));
    }
}));

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('TrackingStore', useTrackingStore);
}

export default useTrackingStore;