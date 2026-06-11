// ********** IMPORTANT CUSTOM CODE FOR KEYS INJECTION - START **********

// Function to load layers from UUID segment
function loadLayersFromHash() {
    // Extract UUID(s) from URL hash (e.g., #uuid1,uuid2)
    // Hash-based routing is used because GitHub Pages doesn't support server-side rewrites.
    // Path-based routing (/demo-open-maps/uuid) only works with webpack dev server.
    const uuidSegment = keys
        ? keys
        : window.location.hash.substring(1); // Remove # symbol

    // If no hash, return empty array (map will init without layers)
    if (!uuidSegment) {
        return [];
    }

    // Split and validate each UUID using cgpv utilities
    const uuids = uuidSegment.split(',').map((uuid) => uuid.trim());
    const invalidUuids = [];

    for (const uuid of uuids) {
        if (!cgpv.api.utilities.core.isValidUUID(uuid)) {
            invalidUuids.push(uuid);
        }
    }

    if (invalidUuids.length > 0) {
        alert(`Invalid UUID(s) found:\n${invalidUuids.join('\n')}\n\nPlease provide valid UUID(s) in the URL hash.`);
        return false;
    }

    return uuids;
}

// Initial load
const initialUuids = loadLayersFromHash();

if (initialUuids !== false) {
    // Proceed with map initialization
    cgpv.onMapInit((mapViewer) => {
    // Add layers only if UUIDs are provided
    if (initialUuids.length > 0) {
        initialUuids.forEach((uuid) => {
            cgpv.api.getMapViewer(mapViewer.mapId).layer.addGeoviewLayerByGeoCoreUUID(uuid);
        });
    }
    });

    cgpv.init();
}

// ********** IMPORTANT CUSTOM CODE FOR KEYS INJECTION - END **********
