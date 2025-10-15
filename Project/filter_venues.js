/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

/**
 * Filter venues by maximum distance from user's current location
 * @param {Array} venues - Array of venue objects with latitude and longitude properties
 * @param {number} userLat - User's current latitude
 * @param {number} userLon - User's current longitude
 * @param {number} maxDistance - Maximum distance in kilometers
 * @returns {Array} Filtered array of venues within the specified distance
 */
function filterVenuesByDistance(venues, userLat, userLon, maxDistance) {
    return venues
        .map(venue => {
            const distance = calculateDistance(
                userLat, 
                userLon, 
                venue.latitude, 
                venue.longitude
            );
            return {
                ...venue,
                distance: distance
            };
        })
        .filter(venue => venue.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance); // Sort by distance, closest first
}

// Example usage:
const venues = [
    { name: "Coffee Shop A", latitude: 40.7128, longitude: -74.0060 },
    { name: "Restaurant B", latitude: 40.7589, longitude: -73.9851 },
    { name: "Park C", latitude: 40.7829, longitude: -73.9654 },
    { name: "Museum D", latitude: 40.7614, longitude: -73.9776 },
    { name: "Gym E", latitude: 40.7489, longitude: -73.9680 }
];

// User's current location (example: Times Square, NYC)
const userLatitude = 40.7580;
const userLongitude = -73.9855;

// Filter venues within 2 kilometers
const nearbyVenues = filterVenuesByDistance(venues, userLatitude, userLongitude, 2);

console.log("Nearby venues within 2km:");
nearbyVenues.forEach(venue => {
    console.log(`${venue.name} - ${venue.distance.toFixed(2)} km away`);
});

// Export for use in other modules (Node.js/ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { filterVenuesByDistance, calculateDistance };
}

