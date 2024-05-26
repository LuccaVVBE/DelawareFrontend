import { Link } from 'react-router-dom'

import '../../styles/orderCard.css'

import useOrderStore from '../../stores/orderStore'
import useTrackingStore from '../../stores/trackingStore'

export default function OrderCard({
    orderId: id,
}) {


    const order = useOrderStore((state) => state.orders.find((order) => order.orderId === id))
    const { fetchTrackingStatus } = useTrackingStore((state) => state)

    const handleTrack = () => {
        fetchTrackingStatus(order.trackAndTrace.number, order.trackAndTrace.verificationCode)
        
    }
        

    return (
        <>
            {order &&
                <div className="orders" data-cy="orderCard">
                    <div key={id} className="tableOrderCard">
                        <span className="orderReceived1">
                            Order received: {new Date(order.orderDate).toLocaleDateString()}{' '}
                        </span>
                        <span className="referance1">Reference no: {id} </span>
                        <span className="status1">Status: {order.trackAndTrace !== null ? order.trackAndTrace.status : "Received"} </span>
                        <span className="amountItems1">
                            Amount of items: {order.orderItems?.length}{' '}
                        </span>
                        <span className="totalOrder1">
                            {order?.trackAndTrace?.number ? <Link className='orderOverview1' to={'/tracking'} onClick={handleTrack}>Track</Link>: null}
                        </span>

                        <Link className="orderOverview1" data-cy="orderInfoButton" to={`/orders/${id}`}>
                            Order overview
                        </Link>
                    </div>
                </div>
            }
        </>

    )
}
