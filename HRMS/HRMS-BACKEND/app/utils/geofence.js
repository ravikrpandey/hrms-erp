const EARTH_RADIUS_METERS = 6371000;
const DEFAULT_ALLOWED_RADIUS_METERS = 150;
const MAX_ACCEPTABLE_ACCURACY_METERS = 150;

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const phi1 = toRadians(Number(lat1));
    const phi2 = toRadians(Number(lat2));
    const deltaPhi = toRadians(Number(lat2) - Number(lat1));
    const deltaLambda = toRadians(Number(lon2) - Number(lon1));

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(EARTH_RADIUS_METERS * c * 100) / 100;
}

function validateGeofence(punchCoords, branchCoords, options = {}) {
    const {
        isWfh = false,
        isDesktop = false,
        maxAccuracyMeters = MAX_ACCEPTABLE_ACCURACY_METERS,
        allowDesktopCoarse = true
    } = options;

    const lat = punchCoords?.latitude != null ? Number(punchCoords.latitude) : null;
    const lon = punchCoords?.longitude != null ? Number(punchCoords.longitude) : null;
    const accuracy = punchCoords?.accuracy != null ? Number(punchCoords.accuracy) : null;

    if (isWfh) {
        return {
            isWithinGeofence: true,
            distanceMeters: null,
            accuracy,
            status: "VERIFIED",
            failureReason: null,
            isWfh: true,
        };
    }

    if (!branchCoords || branchCoords.latitude == null || branchCoords.longitude == null || branchCoords.is_geofence_active === false) {
        return {
            isWithinGeofence: true,
            distanceMeters: null,
            accuracy,
            status: "SKIPPED",
            failureReason: null,
        };
    }

    if (lat == null || lon == null) {
        return {
            isWithinGeofence: false,
            distanceMeters: null,
            accuracy: null,
            status: "PERMISSION_DENIED",
            failureReason: "GPS coordinates were not provided by the device.",
        };
    }

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return {
            isWithinGeofence: false,
            distanceMeters: null,
            accuracy,
            status: "ACCURACY_POOR",
            failureReason: "Invalid GPS coordinates detected.",
        };
    }

    const branchLat = Number(branchCoords.latitude);
    const branchLon = Number(branchCoords.longitude);
    const allowedRadius = Number(branchCoords.geofence_radius_meters) || DEFAULT_ALLOWED_RADIUS_METERS;

    const distance = calculateHaversineDistance(lat, lon, branchLat, branchLon);

    if (isDesktop && allowDesktopCoarse && accuracy != null && accuracy > maxAccuracyMeters) {
        return {
            isWithinGeofence: true,
            distanceMeters: distance,
            accuracy,
            status: "DESKTOP_VERIFIED",
            failureReason: null,
            note: `Desktop workstation punch verified with coarse IP location (±${Math.round(accuracy)}m).`
        };
    }

    if (accuracy != null && accuracy > maxAccuracyMeters) {
        return {
            isWithinGeofence: false,
            distanceMeters: distance,
            accuracy,
            status: "ACCURACY_POOR",
            failureReason: `GPS accuracy is too coarse (±${Math.round(accuracy)}m). High-accuracy GPS (±${maxAccuracyMeters}m or better) is required. Please ensure device GPS/location is enabled.`,
        };
    }

    const effectiveRadius = allowedRadius + Math.min(accuracy || 0, 50);

    if (distance <= effectiveRadius) {
        return {
            isWithinGeofence: true,
            distanceMeters: distance,
            accuracy,
            status: "VERIFIED",
            failureReason: null,
        };
    } else {
        return {
            isWithinGeofence: false,
            distanceMeters: distance,
            accuracy,
            status: "OUTSIDE_GEOFENCE",
            failureReason: `You are ${Math.round(distance)}m away from your office branch (${branchCoords.branch_name || 'Assigned Branch'}). Maximum allowed distance is ${allowedRadius}m.`,
        };
    }
}

module.exports = {
    calculateHaversineDistance,
    validateGeofence,
    EARTH_RADIUS_METERS,
    DEFAULT_ALLOWED_RADIUS_METERS,
};
