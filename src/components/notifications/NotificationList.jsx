import Notification from './Notification'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import useNotificationStore from './../../stores/notificationStore'
import '../../styles/notifications.css'

import Error from '../Error'
import Loader from '../Loader'

export default function NotificationsList() {
    const { getAccessTokenSilently } = useAuth0()

    const { fetchNotifications, notifications, error, loading } =
        useNotificationStore((state) => state)

    useEffect(() => {
        fetchNotifications(getAccessTokenSilently)
    }, [fetchNotifications, getAccessTokenSilently])

    return (
        <>
            <Error error={error} />
            <Loader loading={loading}></Loader>{' '}
            {!loading && !error ? (
                <div
                    className="notifications-list"
                    data-cy="notifications-list"
                >
                    {notifications.data?.map((notification) => (
                        <Notification
                            key={notification.id}
                            id={notification.id}
                            read={notification.read}
                            title={notification.title}
                            description={notification.description}
                            timestamp={notification.timestamp}
                            customerId={notification.customerId}
                            orderId={notification.orderId}
                        />
                    ))}
                </div>
            ) : null}
        </>
    )
}
