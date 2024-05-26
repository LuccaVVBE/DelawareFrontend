import { Link, useNavigate, useLocation } from 'react-router-dom'

import '../../styles/navBar.css'

import SearchBar from './SearchBar.jsx'
import AuthenticationButton from '../authentication/AuthenticationButton'
import { BsCart3, BsFillPersonLinesFill, BsBell } from 'react-icons/bs'
import {CgList} from 'react-icons/cg'
import { TbTruckDelivery } from 'react-icons/tb'
import Sort from './Sort'
import { useAuth0 } from '@auth0/auth0-react'

import useProductStore from './../../stores/productStore'
import useCategoryStore from './../../stores/categoriesStore'
import useNotificationStore from './../../stores/notificationStore'
import { useEffect } from 'react'
import useCustomerStore from '../../stores/customerStore'

function CategorySelector() {
    const navigate = useNavigate()

    const setSelectedCategory = useProductStore(
        (state) => state.setSelectedCategory
    )

    const { categories, fetchCategories } = useCategoryStore((state) => state)

    const handleSelectCategory = (event) => {
        setSelectedCategory(event.target.value)
    }

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    // on select product, navigate to product page even if the category is the same (!= onChange)
    const handleClick = () => {
        navigate('/')
    }

    return (
        <select
            data-cy="nav-category-selector"
            onChange={handleSelectCategory}
            className="nav-selector-box"
        >
            <option key={0} value={0} onClick={handleClick}>
                All products
            </option>
            {categories.map((cat) => (
                <option
                    // BUG: not working in chrome
                    onClick={handleClick}
                    data-cy={`category-option-${cat.categoryId}`}
                    key={cat.categoryId}
                    value={cat.categoryId}
                >
                    {cat.categoryName}
                </option>
            ))}
        </select>
    )
}

export default function NavBar() {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()
    const cart = useProductStore((state) => state.cart)
    const location = useLocation()
    const fetchCustomer = useCustomerStore((state) => state.fetchCustomer)

    const {
        fetchNotifications,
        unreadNotificationsCount,
        error: notificationsError,
        loading: notificationsLoading,
    } = useNotificationStore((state) => state)

    useEffect(() => {
        if (isAuthenticated){
             fetchNotifications(getAccessTokenSilently)
             fetchCustomer(getAccessTokenSilently, user)
        }
        // eslint-disable-next-line
    }, [fetchNotifications, getAccessTokenSilently, isAuthenticated])

    function calculateTotalInCart() {
        const total = cart.reduce((acc, item) => {
            return acc + item.wantedQuantity
        }, 0)
        return total
    }

    return (
        <header>
            <nav className="top">
                <ul>
                    <li id="companyName">Delaware</li>
                    <li>
                        <AuthenticationButton />
                    </li>

                    {isAuthenticated ? (
                        <li>
                            <Link to="/profile">
                                <BsFillPersonLinesFill className="top-nav-icon" />
                            </Link>
                        </li>
                    ) : null}

                    {isAuthenticated ? (
                        !notificationsError || !notificationsLoading ? (
                            <li>
                                <Link
                                    to="/notifications"
                                    data-cy="unreadNotificationsCount"
                                >
                                    <BsBell className="top-nav-icon" />{' '}
                                    {unreadNotificationsCount &&
                                    unreadNotificationsCount > 0 ? (
                                        <span className="cart-count">
                                            {unreadNotificationsCount}
                                        </span>
                                    ) : null}
                                </Link>
                            </li>
                        ) : null
                    ) : null}

                    {isAuthenticated ? (
                        !notificationsError || !notificationsLoading ? (
                            <li>
                                <Link
                                    to="/orders"
                                    data-cy="navOrders"
                                >
                                    <CgList className="top-nav-icon" />{' '}
                                </Link>
                            </li>
                        ) : null
                    ) : null}

                    <li>
                        <Link to="/tracking" data-cy="navTrack">
                            <TbTruckDelivery className="top-nav-icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/cart" data-cy="navCart">
                            <BsCart3 className="top-nav-icon" />
                            {cart && cart.length > 0 ? (
                                <span className="cart-count" data-cy="cartCount">
                                    {calculateTotalInCart()}
                                </span>
                            ) : null}
                        </Link>
                    </li>
                </ul>{' '}
            </nav>
            {location.pathname === '/' ? (
                <nav className="bottom">
                    <ul>
                        <CategorySelector />
                        <Sort />
                        <SearchBar />
                    </ul>
                </nav>
            ) : (
                <nav className="bottom">
                    <Link to="/" className="backToProductsPage ">
                        Return back to products
                    </Link>
                </nav>
            )}
        </header>
    )
}
