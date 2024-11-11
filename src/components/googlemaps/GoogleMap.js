/* global google */

import React, { useCallback, useEffect, useRef, useState } from 'react';

const GoogleMapComponent = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [searchPrompt, setSearchPrompt] = useState('');
  const [map, setMap] = useState(null); // State to store the map object
  const [markers, setMarkers] = useState([]); // State to track markers
  const serviceRef = useRef(null);
  const infowindowRef = useRef(null);

  const loadGoogleMapsScript = () => {
    const googleMapsApiKey = process.env.REACT_APP_API_KEY;

    if (!googleMapsApiKey) {
      console.error('Google Maps API Key is missing');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);
  };

  // Initialize the map
  const initMap = () => {
    const center = { lat: 51.0447, lng: -114.0719 }; // Default center (e.g., Toronto)

    const newMap = new google.maps.Map(document.getElementById('map'), {
      center,
      zoom: 12,
    });

    infowindowRef.current = new google.maps.InfoWindow();
    serviceRef.current = new google.maps.places.PlacesService(newMap);

    setMap(newMap); // Set the map in state
    return newMap;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          () => {
            reject('Geolocation failed');
          }
        );
      } else {
        reject('Geolocation not supported');
      }
    });
  };

  // Search places based on prompt and location
  const searchPlaces = useCallback(async (prompt) => {
    if (!serviceRef.current || !map) return;

    try {
      const coords = await getCurrentLocation(); // Get current location
      const location = new google.maps.LatLng(coords.latitude, coords.longitude); // Convert coords to LatLng

      // Set the location in the map
      map.setCenter(location);

      // Request to find places based on search prompt
      const request = {
        query: prompt, // Search query (e.g., 'Mexican food')
        location: location, // User's current location
        radius: 5000, // Search within a 5km radius
        type: 'restaurant', // Search for restaurants
      };

      // Clear existing markers before adding new ones
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      setMarkers([]); // Clear the markers state

      // Perform the place search
      serviceRef.current.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Iterate over the results and create markers
          results.forEach((place) => {
            createMarker(place, map);
          });
          // If there are results, set the map's center to the first result
          map.setCenter(results[0].geometry.location);
        } else {
          console.error('No results found:', status);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, [map, markers]);

  // Create a marker for each place
  const createMarker = (place, map) => {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      title: place.name,
    });

    google.maps.event.addListener(marker, 'click', () => {
      infowindowRef.current.setContent(
        `<div><strong>${place.name}</strong><br>${place.formatted_address}</div>`
      );
      infowindowRef.current.open(map, marker);
    });

    setMarkers((prevMarkers) => [...prevMarkers, marker]); // Add the new marker to state
  };

  useEffect(() => {
    if (isScriptLoaded && !map) {
      initMap(); // Initialize map once the script is loaded
    }
  }, [isScriptLoaded, map]);

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    searchPlaces(searchPrompt); // Trigger search when the user selects an option
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ textAlign: 'center', margin: '20px' }}>
        <select
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        >
          <option value="">Select Cuisine</option>
          <option value="Mexican food">Mexican food</option>
          <option value="Italian food">Italian food</option>
          <option value="Chinese food">Chinese food</option>
          <option value="Indian food">Indian food</option>
          <option value="Japanese food">Japanese food</option>
          <option value="Thai food">Thai food</option>
          <option value="Haitian food">Haitian food</option>
          <option value="Japanese food">Japanese food</option>
          <option value="Vietnamese food">Vietnamese food</option>
          <option value="American food">American food</option>
        </select>
        <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>
          Search
        </button>
      </form>
      
      <div
        id="map"
        style={{ width: '100%', height: '80vh', border: '1px solid #ddd', borderRadius: '8px' }}
      ></div>
    </div>
  );
};

export default GoogleMapComponent;
