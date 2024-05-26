import axios from "axios";
import {
    create
} from "zustand";


const baseUrl = `${process.env.REACT_APP_API_URL}/product-categories`;

const useCategoryStore = create((set, get) => ({
    loading: false,
    error: null,
    categories: [],

    fetchCategories: async () => {
        try {
            set(() => ({
                error: null,
            }));
            set(() => ({
                loading: true
            }));

            const response = await axios(`${baseUrl}`)
            const categories = response.data;


            set(() => ({
                categories
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

export default useCategoryStore;