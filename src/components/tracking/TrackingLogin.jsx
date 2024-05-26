import { useState } from 'react';
import useTrackingStore from '../../stores/trackingStore';

export default function TrackingLogin({handleTrack}) {

    const {error} = useTrackingStore();
    const [trackingNumber, setTrackingNumber] = useState('');
    const [confirmationNumber, setConfirmationNumber] = useState('');

    function handleEdit(e){
        if(e.target.id === 'track'){
            setTrackingNumber(e.target.value)
        } else if(e.target.id === 'conf'){
            if(e.target.value.match(/^[0-9]*$/)){
                setConfirmationNumber(e.target.value)
            }
        }
    }

    
    return (
        <div>
            <h2>Tracking Login</h2>
            <div className="trackDetailsLogin">
                {error && <p data-cy="trackError" className="alert alert-danger">{error.message}</p>}
                <label htmlFor="track">Tracking number</label>
                <input type="text" data-cy="trackNumber" id="track" value={trackingNumber} onChange={handleEdit}/>
                <label htmlFor="conf">Confirmation number</label>
                <input title="Numbers only." data-cy="trackConfirm" type="text" id="conf" value={confirmationNumber} onChange={handleEdit}/>
                <input type="submit" value="View status" data-cy="submitTrack" onClick={()=>handleTrack(trackingNumber, confirmationNumber)}/>
            </div>
        </div>
        

    )
}