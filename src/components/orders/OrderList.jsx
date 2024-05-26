import { useEffect } from 'react'
import '../../styles/orderList.css'

import OrderCard from './OrderCard'
import useOrderStore from '../../stores/orderStore'

import { useAuth0 } from '@auth0/auth0-react'
import Error from '../Error'
import Loader from '../Loader'

export default function OrderList() {
    const { fetchOrders, orders, loading, error } = useOrderStore((state) => state)
    const { getAccessTokenSilently } = useAuth0()

    useEffect(() => {
        fetchOrders(getAccessTokenSilently)
        // eslint-disable-next-line
    }, [])
    return (
        <>
            <Error error={error} />
            <Loader loading={loading}></Loader>{' '}
            {!loading && !error && (
                <div className="orderList">
                    <h2 className="titel">Order History</h2>
                    {orders.sort(function (a, b) {
                        if (a.orderId > b.orderId) {
                            return -1;
                        }
                        if (a.orderId < b.orderId) {
                            return 1;
                        }
                        return 0;
                    }).map((order) => (
                        <OrderCard
                            key={order.orderId}
                            {...order}
                        />
                    ))}
                </div>
            )}</>
    )
}
