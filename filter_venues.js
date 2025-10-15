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

/**
 * Filter venues by type
 * @param {Array} venues - Array of venue objects
 * @param {string} venueType - Type of venue to filter by (e.g., 'restaurant', 'bar', 'cafe')
 * @returns {Array} Filtered array of venues of the specified type
 */
function filterVenuesByType(venues, venueType) {
    if (!venueType) {
        return venues; // Return all venues if no type specified
    }
    
    return venues.filter(venue => {
        // Check if venue has a type property and if it matches the filter
        return venue.type && venue.type.toLowerCase() === venueType.toLowerCase();
    });
}

/**
 * Sort venues by specified criteria
 * @param {Array} venues - Array of venue objects
 * @param {string} sortBy - Sort criteria: 'distance', 'name', or 'type'
 * @returns {Array} Sorted array of venues
 */
function sortVenues(venues, sortBy) {
    switch (sortBy) {
        case 'distance':
            return venues.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        case 'name':
            return venues.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        case 'type':
            return venues.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
        default:
            return venues; // Return unsorted if invalid sort criteria
    }
}

/**
 * Filter and sort venues by multiple criteria
 * @param {Array} venues - Array of venue objects
 * @param {number} userLat - User's current latitude
 * @param {number} userLon - User's current longitude
 * @param {number} maxDistance - Maximum distance in kilometers
 * @param {string} venueType - Type of venue to filter by (optional)
 * @param {string} sortBy - Sort criteria: 'distance', 'name', or 'type'
 * @returns {Array} Filtered and sorted array of venues
 */
function filterAndSortVenues(venues, userLat, userLon, maxDistance, venueType = '', sortBy = 'distance') {
    // First filter by distance
    let filteredVenues = filterVenuesByDistance(venues, userLat, userLon, maxDistance);
    
    // Then filter by type if specified
    if (venueType) {
        filteredVenues = filterVenuesByType(filteredVenues, venueType);
    }
    
    // Finally sort by the specified criteria
    return sortVenues(filteredVenues, sortBy);
}

// Example usage:
const venues = [
    { name: "Coffee Shop A", latitude: 40.7128, longitude: -74.0060, type: "cafe" },
    { name: "Restaurant B", latitude: 40.7589, longitude: -73.9851, type: "restaurant" },
    { name: "Park C", latitude: 40.7829, longitude: -73.9654, type: "park" },
    { name: "Museum D", latitude: 40.7614, longitude: -73.9776, type: "museum" },
    { name: "Gym E", latitude: 40.7489, longitude: -73.9680, type: "gym" },
    { name: "Bar & Grill", latitude: 40.7500, longitude: -73.9800, type: "bar" },
    { name: "Pizza Palace", latitude: 40.7550, longitude: -73.9750, type: "restaurant" },
    { name: "Night Club X", latitude: 40.7600, longitude: -73.9700, type: "nightclub" },
    { name: "Sports Bar", latitude: 40.7450, longitude: -73.9850, type: "bar" },
    { name: "Fast Food Corner", latitude: 40.7400, longitude: -73.9900, type: "fast_food" }
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
    module.exports = { 
        filterVenuesByDistance, 
        filterVenuesByType, 
        sortVenues, 
        filterAndSortVenues, 
        calculateDistance 
    };
}

