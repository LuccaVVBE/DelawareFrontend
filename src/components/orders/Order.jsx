import { useParams } from 'react-router'
import { useEffect } from 'react'

import '../../styles/order.css'

import useOrderStore from '../../stores/orderStore'

import OrderItems from './OrderItems'

import OrderChange from './OrderChange';
import { useAuth0 } from '@auth0/auth0-react'
import useProductStore from '../../stores/productStore'
import Error from '../Error'
import Loader from '../Loader'

import { formatToCurrency, calculateVAT, calculatePriceExclVAT, calculateTotal, calculateShipping } from '../../util/global-functions'

export default function Order() {
    const { products } = useProductStore((state) => state)
    const { id } = useParams()
    const { getAccessTokenSilently } = useAuth0();
    const { fetchSingleOrder, singleOrder, error, loading } = useOrderStore((state) => state)

    useEffect(() => {
        fetchSingleOrder(getAccessTokenSilently, id)
        // eslint-disable-next-line
    }, [])


    const orderedProducts = singleOrder.orderItems?.map((product) => {
        product = {
            ...product,
            name: products.find((p) => p.id === product.productId).productDescription.productName,
            price: products.find((p) => p.id === product.productId).productPrice[0].price,
            linkToImg: products.find((p) => p.id === product.productId).linkToImg,
            productDescription: products.find((p) => p.id === product.productId).productDescription.productShortDescription,
        }
        return product;
    })


    return (
        <>
            <Error error={error} />
            <Loader loading={loading}></Loader>{' '}
            {!loading && !error && (
                <div className="order" data-cy="orderInfo" key={singleOrder.orderId}>
                    <div>
                        <h2 className="titelOrderDetail">Order Detail</h2>
                        {singleOrder.trackAndTrace?.status === "Received" &&
                            <OrderChange address={singleOrder.address} id={singleOrder.orderId} />
                        }
                    </div>
                    <div className="tableOrder">

                        <span className="ordered">
                            Ordered: {new Date(singleOrder.orderDate).toLocaleDateString()}
                        </span>

                        <span className="referance">
                            Reference no: {singleOrder.orderId}{' '}
                        </span>

                        <span className="amountItems2" data-cy="amountItemsOrder">
                            {orderedProducts?.length}
                            {orderedProducts?.length === 1 ? " ITEM" : " ITEMS"}
                        </span>

                        <span className="status">Status: {singleOrder.trackAndTrace?.status} </span>

                        <span className="orderAdres">{singleOrder?.adres}</span>

                        <div className="totalOrder">
                            <table className="tableWithPrice">
                                <thead>
                                    <tr>
                                        <td className="subtotalOrder">Subtotal</td>
                                        <td>{calculatePriceExclVAT(orderedProducts ? orderedProducts : [])}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="vatAndShippingOrder">
                                            VAT (21%)
                                        </td>
                                        <td>{calculateVAT(orderedProducts ? orderedProducts : [])}</td>
                                    </tr>
                                    <tr>
                                        <td className="vatAndShippingOrder">
                                            Shipping
                                        </td>
                                        <td>{formatToCurrency(calculateShipping(singleOrder))}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="totalInOrder">Total</b>
                                        </td>
                                        <td>
                                            <b>
                                                {formatToCurrency(calculateTotal(orderedProducts ? orderedProducts : []).add(calculateShipping(singleOrder)))}
                                            </b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="">
                        <div className="orderItems">
                            {!singleOrder.orderItems || singleOrder.orderItems === 0 ? (
                                <p data-cy="empty">
                                    The order does not contain any orderItems.
                                </p>
                            ) : (
                                orderedProducts.map((product) => (
                                    <OrderItems key={product.productId} product={product} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
