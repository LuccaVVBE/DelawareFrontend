import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import useCustomerStore from '../../stores/customerStore'

import { useEffect } from 'react'

export default function AuthenticationButton() {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()
    const fetchCustomer = useCustomerStore((state) => state.fetchCustomer)

    useEffect(() => {
        if (isAuthenticated) {
            fetchCustomer(getAccessTokenSilently, user)
        }
    }, [isAuthenticated, fetchCustomer, getAccessTokenSilently, user])

    if (isAuthenticated) {
        return (
            <div>
                <LogoutButton />
            </div>
        )
    }

    return <LoginButton />
}
