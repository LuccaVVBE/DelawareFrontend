import useProductStore from './../../stores/productStore'
import { TbTruckDelivery, TbCreditCard } from 'react-icons/tb'
import { RiCustomerService2Fill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import '../../styles/cart.css'

import { useEffect, useCallback } from 'react'

import CartItem from './CartItem'

import Error from '../Error'
import Loader from '../Loader'

import {
    getEstimatedDeliveryDate,
    calculatePriceExclVAT,
    calculateTotal,
    calculateVAT,
    formatToCurrency,
} from '../../util/global-functions'

export default function Cart() {
    const { cart, fetchCartItems, error, loading } = useProductStore(
        (state) => state
    )

    const navigate = useNavigate()

    const { loginWithRedirect, isAuthenticated } = useAuth0()

    useEffect(() => {
        fetchCartItems()
        // eslint-disable-next-line
    }, [])

    const handleCheckout = useCallback(async () => {
        if (!isAuthenticated) {
            loginWithRedirect()
            return
        }
        if (cart.length === 0) {
            alert('Cart is empty')
            return
        }
        navigate('/checkout')
    }, [loginWithRedirect, cart, navigate, isAuthenticated])

    return (
        <>
            <Error error={error} />
            <Loader loading={loading}></Loader>{' '}
            {!loading && !error ? (
                <div className="cart">
                    <div className="compHeader">
                        <h2>Cart</h2>
                        <button
                            className="primary"
                            data-cy="orderButton"
                            onClick={handleCheckout}
                        >
                            Proceed to checkout
                        </button>
                    </div>

                    <div className="cartItems">
                        {cart.length === 0 ? (
                            <p data-cy="empty">Cart is empty.</p>
                        ) : (
                            cart
                                // .sort((prodA, prodB) =>  prodA.id - prodB.id)
                                .map((product) => (
                                    <CartItem
                                        key={product.id}
                                        product={product}
                                    />
                                ))
                        )}
                    </div>

                    <div className="shippingAndTotal">
                        <div className="shipping box">
                            <h4>Estimated delivery</h4>
                            <p>{getEstimatedDeliveryDate(cart)}</p>
                        </div>
                        <div className="total">
                            <table>
                                <thead>
                                    <tr>
                                        <td>Subtotal</td>
                                        <td>
                                            {formatToCurrency(
                                                calculatePriceExclVAT(cart)
                                            )}
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>VAT (21%)</td>
                                        <td>
                                            {formatToCurrency(
                                                calculateVAT(cart)
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Total</b>
                                        </td>
                                        <td>
                                            <b>
                                                {formatToCurrency(
                                                    calculateTotal(cart)
                                                )}
                                            </b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="features box">
                        <div className="feature">
                            <span>Fast shipping</span>
                            <span className="icon">
                                <TbTruckDelivery />
                            </span>
                        </div>
                        <div className="feature">
                            <span>Secure payment</span>
                            <span className="icon">
                                <TbCreditCard />
                            </span>
                        </div>
                        <div className="feature">
                            <span>Customer Service</span>
                            <span className="icon">
                                <RiCustomerService2Fill />
                            </span>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
