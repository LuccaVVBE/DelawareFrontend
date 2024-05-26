import { memo, useState } from 'react'
import useNotificationStore from '../../stores/notificationStore'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

export default memo(function Notification({
    id,
    read,
    title,
    description,
    timestamp,
    orderId,
}) {
    const markAsRead = useNotificationStore((state) => state.markAsRead)
    const { getAccessTokenSilently } = useAuth0()

    const [readState, setReadState] = useState(read)

    const handleMarkAsRead = () => {
        markAsRead(id, getAccessTokenSilently)
        setReadState(true)
    }

    return (
        <div className={`notification ${readState ? 'read' : 'unread'}`}>
            <div style={{ display: 'flex' }}>
                <p className="timestamp">
                    {new Date(timestamp).toLocaleString()}
                </p>{' '}
                <h3>{title}</h3>
                <Link
                    className="navigateToOrder"
                    to={orderId ? `/orders/${orderId}` : ''}
                >
                    Navigate to order
                </Link>
                <p>{description}</p>
                {!readState ? (
                    <div
                        onClick={handleMarkAsRead}
                        className="markAsRead"
                        data-cy="markAsRead-button"
                    >
                        Mark as read
                    </div>
                ) : null}
            </div>
        </div>
    )
})
