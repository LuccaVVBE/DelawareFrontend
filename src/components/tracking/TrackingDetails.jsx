
import useTrackingStore from '../../stores/trackingStore';
import { FaWarehouse } from 'react-icons/fa';
import { GiBoxUnpacking } from 'react-icons/gi';
import { TbTruckDelivery, TbPackage } from 'react-icons/tb';
import '../../styles/tracking.css'
import ProgressBar from '@ramonak/react-progress-bar';


export default function TrackingDetails({ reset }) {
    const { trackingStatus } = useTrackingStore();
    const statusses = ['Received', 'Processing', 'In transit', 'Delivered']
    const statusIndex = statusses.indexOf(trackingStatus.status);

    function giveClassName(status) {
        if (statusses.indexOf(status) === statusIndex) {
            return "active";
        } else {
            return "unactive";

        }
    }

    function giveProgressPercentage() {
        if (statusIndex === 0) {
            return 12;
        }
        if (statusIndex === 1) {
            return 36;
        }
        if (statusIndex === 2) {
            return 68;
        }
        if (statusIndex === 3) {
            return 100;
        }
        if (statusIndex === -1) {
            return 0;
        }
    }



    return (<>{trackingStatus &&
        <div>
            <h2>Tracking Details</h2>
            <button data-cy="trackBack" className='back primary' onClick={reset}>Go back</button>
            <div data-cy="trackDetails" className="trackingDetails">
                <div className='trackInfo'>
                    <p>Tracking number: {trackingStatus.number}</p>
                    <p>Carrier: {trackingStatus.carrier.name}</p>
                    <p>Packaged in: {trackingStatus.order.packingType}</p>
                    <p data-cy="trackStatus">Current status: {trackingStatus.status}</p>
                    <p>Order date: {new Date(trackingStatus.order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className='custInfo'>
                    <p>Address info</p>
                    <p>{trackingStatus.order.address.name}</p>
                    <p>{trackingStatus.order.address.street} {trackingStatus.order.address.number}</p>
                    <p>{trackingStatus.order.address.zipCode} {trackingStatus.order.address.city}</p>
                    <p>{trackingStatus.order.address.country}</p>
                </div>
            </div>
            <div className="trackingStatus">
                <ProgressBar bgColor='red' height='25px' className='progressBar' completed={giveProgressPercentage()} customLabel={trackingStatus.status} />
                <div className='trackingIcons'>
                    <FaWarehouse className={giveClassName(statusses[0])} />
                    <TbPackage className={giveClassName(statusses[1])} />
                    <TbTruckDelivery className={giveClassName(statusses[2])} />
                    <GiBoxUnpacking className={giveClassName(statusses[3])} />
                </div>
            </div>
        </div>
    }</>);

}

