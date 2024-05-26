
import TrackingDetails from "./TrackingDetails";
import TrackingLogin from "./TrackingLogin";
import useTrackingStore from "../../stores/trackingStore";

export default function Tracking(){
    const {trackingStatus, fetchTrackingStatus} = useTrackingStore();
    async function handleTrack(trackNumber, confNumber){
        await fetchTrackingStatus(trackNumber, confNumber);
    }

    function resetStatus(){
        useTrackingStore.setState({trackingStatus: null});
    }


    return(
        <div className="tracking">
            {trackingStatus && <TrackingDetails reset={resetStatus}/>}
            {!trackingStatus && <TrackingLogin handleTrack={handleTrack}/>}
            
        </div>

    )
}