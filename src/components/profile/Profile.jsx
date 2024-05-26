import '../../styles/profile.css'
import useCustomerStore from '../../stores/customerStore'
export default function Profile() {
    const { customer, company } = useCustomerStore((state) => state)

    return (
        <div className="profile">
            <div className="personalInfo">
                <h2>Personal</h2>

                <div className="personal">
                    <div className="personalText">
                        <p>
                            <b>First name:</b>
                            <br />
                            {customer.firstName}
                        </p>
                        <p>
                            <b>Last name:</b>
                            <br />
                            {customer.secondName}
                        </p>
                        <p>
                            <b>Preferred Address:</b>
                            <br />
                            {company.addresses[0].name}<br />{company.addresses[0].street} {company.addresses[0].number}<br />{company.addresses[0].zipCode} {company.addresses[0].city}<br />{company.addresses[0].country}
                        </p>
                        <p>
                            <b>Email:</b>
                            <br />
                            {customer.email}
                        </p>
                    </div>
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/008/214/517/original/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg"
                        alt="Company logo"
                    />
                </div>
            </div>
        </div>
    )
}
