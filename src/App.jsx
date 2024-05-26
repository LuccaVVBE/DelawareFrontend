import './styles/b2bportalcolors.css'

import useProductStore from './stores/productStore'

import ScrollToTop from './ScrollToTop'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

import ProductList from './components/products/ProductList'
import Cart from './components/cart/Cart'
import NavBar from './components/navbar/NavBar'
import AuthLanding from './components/LandingPage'
import Product from './components/products/Product'
import Checkout from './components/cart/Checkout'
import Profile from './components/profile/Profile'
import OrderList from './components/orders/OrderList'
import Order from './components/orders/Order'
import RequireAuth from './components/authentication/RequireAuth'
import Tracking from './components/tracking/Tracking'
import NotificationList from './components/notifications/NotificationList.jsx'

function App() {
    const { fetchProducts } = useProductStore((state) => state)

    useEffect(() => {
        fetchProducts()
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <ScrollToTop />
            <div className="App">
                <Routes>
                    <Route
                        path="/template"
                        element={
                            <div className="Template">
                                <header>
                                    <div className="top">top header</div>
                                    <div className="bottom">bottom header</div>
                                </header>
                                <body>
                                    <h1>h1</h1>
                                    <h2>h2</h2>
                                </body>
                                <footer>
                                    <div className="top">top footer</div>
                                    <div className="bottom">bottom footer</div>
                                </footer>
                            </div>
                        }
                    />
                    <Route
                        index
                        path="*"
                        element={
                            <>
                                <NavBar />
                                <ProductList />
                            </>
                        }
                    />
                    <Route
                        path="/products/:id"
                        element={
                            <>
                                <NavBar />
                                <Product />
                            </>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <>
                                <NavBar />{' '}
                                <RequireAuth>
                                    <OrderList />
                                </RequireAuth>
                            </>
                        }
                    />
                    <Route
                        path="/orders/:id"
                        element={
                            <>
                                <NavBar />{' '}
                                <RequireAuth>
                                    <Order />{' '}
                                </RequireAuth>
                            </>
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <>
                                <NavBar />
                                <Cart />
                            </>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <>
                                <NavBar />
                                <Checkout />
                            </>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <>
                                <AuthLanding />
                            </>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <>
                                <NavBar />
                                <RequireAuth>
                                    <Profile />
                                </RequireAuth>
                            </>
                        }
                    />
                    <Route
                        path="/tracking"
                        element={
                            <>
                                <NavBar />
                                <Tracking />
                            </>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <>
                                <NavBar />
                                <RequireAuth>
                                    <NotificationList />
                                </RequireAuth>
                            </>
                        }
                    />
                </Routes>
            </div>
        </>
    )
}

export default App
