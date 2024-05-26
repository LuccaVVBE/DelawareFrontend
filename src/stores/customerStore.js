import axios from "axios";
import {
    create
} from "zustand";
import {
    mountStoreDevtool
} from "simple-zustand-devtools";

const baseUrl = `${process.env.REACT_APP_API_URL}/customers`;


const useCustomerStore = create((set) => ({
    loading: false,
    error: null,
    customer: {},
    company: null,

    fetchCustomer: async (getAccessTokenSilently, user) => {

        try {

            set(() => ({
                loading: true,
                error: null,
            }));

            const token = await getAccessTokenSilently();

            const responseCustomer = await axios(`${baseUrl}/${user.sub}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseCompany = await axios(`${process.env.REACT_APP_API_URL}/companies/${responseCustomer.data.companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            set(() => ({
                customer: responseCustomer.data,
                company: responseCompany.data
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

}));

export default useCustomerStore;

if (process.env.NODE_ENV === "development") {
    mountStoreDevtool("CustomerStore", useCustomerStore);
}