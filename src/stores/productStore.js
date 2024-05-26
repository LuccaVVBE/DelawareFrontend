import axios from "axios";
import {
    create
} from "zustand";
import {
    mountStoreDevtool
} from 'simple-zustand-devtools';

const baseUrl = `${process.env.REACT_APP_API_URL}/products`;

const useProductStore = create((set, get) => ({
    loading: false,
    error: null,
    products: [],
    singleProduct: {},
    searchTerm: "",
    selectedCategory: "0",
    cart: window.localStorage.getItem("cart") ? getCartFromLocalStorage() : [],
    sortOption: "name-asc",


    fetchProducts: async () => {
        try {
            set({
                loading: true,
                error: null
            });
            const response = await axios(`${baseUrl}/?language=en`)
            const products = response.data.items;

            set({
                products
            });

            get().cart.forEach((cartItem) => {
                get().products.find((product) => cartItem.productId === product.productId).wantedQuantity = get().cart.find((cartI) => cartI.productId === cartItem.productId).wantedQuantity;
            });
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


    fetchSingleProduct: async (id) => {
        try {
            set({
                loading: true,
                error: null
            });
            const response = await axios(`${baseUrl}/${id}?language=en`)
            const product = response.data;


            set((state) => ({
                singleProduct: product,
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

    fetchCartItems: async () => {
        try {
            set({
                loading: true,
                error: null
            });
            await get().fetchProducts();

            get().cart.forEach((cartItem) => {
                const toPutInCart = {};
                let product = get().products.find((product) => cartItem.id === product.id);
                toPutInCart.id = cartItem.id;
                toPutInCart.wantedQuantity = cartItem.wantedQuantity;
                toPutInCart.linkToImg = product.linkToImg;
                toPutInCart.shortDescription = product.productDescription.productShortDescription;
                toPutInCart.productName = product.productDescription.productName;
                toPutInCart.price = product.productPrice[0].price;
                toPutInCart.productCurrencyId = product.productPrice[0].productCurrencyId;
                toPutInCart.eta = product.eta;
                product = null;
                set((state) => ({
                    cart: [...state.cart.filter((product) => product.id !== toPutInCart.id), toPutInCart]
                }));
            });
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

    setSelectedCategory: (category) => {
        set(() => ({
            selectedCategory: category
        }));
    },

    setSortOption: (option) => {
        set(() => ({
            sortOption: option
        }));
    },


    // Search for products by name
    searchProducts: (searchTerm) => {
        set(() => ({
            searchTerm
        }));
    },

    // Get filtered products based on search term
    filteredProducts: () => {
        const {
            searchTerm,
            selectedCategory,
            sortOption
        } = get();


        return get().products.filter(product =>
                product.productDescription.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedCategory === "0" || product.category.categoryId === selectedCategory)
            )
            .sort((a, b) => {
                switch (sortOption) {
                    case "name-asc":
                        return a.productDescription.productName.localeCompare(b.productDescription.productName);
                    case "name-des":
                        return b.productDescription.productName.localeCompare(a.productDescription.productName);
                    case "price-asc":
                        return a.productPrice[0].price - b.productPrice[0].price;
                    case "price-des":
                        return b.productPrice[0].price - a.productPrice[0].price;
                    default:
                        return a.productDescription.productName.localeCompare(b.name);
                }
            });

    },


    addOneToCart: (id) => {
        let productsInCart = getCartFromLocalStorage() || [];
        let product = get().cart.find((p) => p.id === id);


        if (!product || product.wantedQuantity == null) {
            product = {};
            product.id = id;
            product.wantedQuantity = 1;
            set((state) => ({
                cart: [...state.cart, product]
            }));
            productsInCart = [...productsInCart, product]
        } else {
            get().cart.find((p) => p.id === id).wantedQuantity = product.wantedQuantity + 1;
            productsInCart.find((p) => p.id === id).wantedQuantity = product.wantedQuantity;
            set((state) => ({
                cart: [...state.cart]
            }));
        }


        setInLocalStorageCart([...productsInCart]);
    },
    removeOneFromCart: (id) => {

        let productsInCart = getCartFromLocalStorage();
        let product = get().cart.find((p) => p.id === id);

        if (!product) {
            return;
        }
        if (product.wantedQuantity >= 1) {
            get().cart.find((p) => p.id === id).wantedQuantity = product.wantedQuantity - 1;
            productsInCart.find((p) => p.id === id).wantedQuantity = product.wantedQuantity;
            set((state) => ({
                cart: [...state.cart]
            }));

        }
        if (get().cart.find((p) => p.id === id).wantedQuantity <= 0) {
            set((state) => ({
                cart: [...state.cart.filter((product) => product.id !== id)]
            }));
            productsInCart = productsInCart.filter((product) => product.id !== id);

        }
        setInLocalStorageCart([...productsInCart]);
    },

    clearCart: () => {
        set(() => ({
            cart: []
        }));
        setInLocalStorageCart([]);
    }

}));

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('ProductStore', useProductStore);
}

export default useProductStore;

function setInLocalStorageCart(cart) {
    window.localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartFromLocalStorage() {
    return JSON.parse(window.localStorage.getItem("cart"));
}