import axios from "axios";

export const geoCoordinatesFromAddress = async (address: string)=>{
    try {
        if(!process.env.GOOGLE_MAPS_API_KEY){
            console.log("Google map api key not in env");
            return null;
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${apiKey}`;

        const response = await axios.get(url);
        console.log("response",response);
        if(!response.data.results || response.data.results.length === 0){
            console.log("No geocoding for adress :",address);
            return null;
        }

         const location = response.data.results[0].geometry.location;

    return {
      latitude: location.lat,
      longitude: location.lng,
    };

    } catch (error:any) {
        console.log("Error in getting coordinates ",error.message)
        return null;
    }
}