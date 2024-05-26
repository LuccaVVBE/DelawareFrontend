import axios from "axios";
import {
    create
} from "zustand";

import {
    mountStoreDevtool
} from 'simple-zustand-devtools';

import useProductStore from "./productStore";
import useCustomerStore from "./customerStore";

const baseUrl = `${process.env.REACT_APP_API_URL}/orders`;

const clearCart = useProductStore.getState().clearCart;

const useOrderStore = create((set) => ({
    loading: false,
    error: null,
    orders: [],
    singleOrder: {},

    fetchOrders: async (getAccessTokenSilently) => {
        try {
            set(() => ({
                error: null,
            }));
            set(() => ({
                loading: true
            }));


            const response = await axios(`${baseUrl}/?language=en`,
                {
                    headers: {
                        Authorization: `Bearer ${await getAccessTokenSilently()}`,
                    },
                }
            );
            const orders = response.data.items;
            set(() => ({
                orders
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


    fetchSingleOrder: async (getAccessTokenSilently,id) => {
        try {
            set(() => ({
                error: null,
            }));
            set(() => ({
                loading: true
            }));

            const response = await axios(`${baseUrl}/${id}?language=en`,
            {
                headers:{
                    Authorization: `Bearer ${await getAccessTokenSilently()}`
                }
            })
            const order = response.data;
            set(() => ({
                singleOrder: order,
            }));
            set(() => ({
                loading: false
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

    order: async (getAccessTokenSilently, data) => {
        const company = useCustomerStore.getState().company;

        set({
            loading: true
        });

        try {
            data = {
                orderItems: JSON.parse(window.localStorage.getItem("cart")).map((item) => {
                    return {
                        productId: item.id,
                        quantity: item.wantedQuantity
                    }
                }),
                orderDateTime: new Date(),
                companyId: company.id,
                ...data
            }

            const response = await axios.post(`${baseUrl}`, {
                ...data
            }, 
            {
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                },
            });

            if (response.status === 200) {
                clearCart()
                return response.data.orderId;
            }

        } catch (error) {
            set({
                error
            });
            return null;
        } finally {
            set({
                loading: false
            });
        }
    },

    editOrder: async (id, address, getAccessTokenSilently) => {
        try{
            set(() => ({
                error: null,
            }));
            set(() => ({
                loading: true
            }));

            await axios.put(`${baseUrl}/${id}`, {
                address
            },
            {
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                },

            });
            

        }
        catch(error){
            set({
                error
            });
        }
        finally{
            set({
                loading: false
            });
        }
        
    }
}))


export default useOrderStore;

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('OrderStore', useOrderStore);
}