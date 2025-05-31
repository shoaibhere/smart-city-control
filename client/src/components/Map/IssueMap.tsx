
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IssueMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  selectedLocation?: { lat: number; lng: number; address: string } | null;
}

const IssueMap: React.FC<IssueMapProps> = ({ onLocationSelect, selectedLocation }) => {
  const [isMapVisible, setIsMapVisible] = useState(false);

  const handleLocationClick = () => {
    // Mock location selection for demo
    const mockLocation = {
      lat: 40.7128,
      lng: -74.0060,
      address: "New York, NY 10001"
    };
    
    if (onLocationSelect) {
      onLocationSelect(mockLocation);
    }
    setIsMapVisible(false);
  };

  if (!isMapVisible) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsMapVisible(true)}
          className="w-full h-12 flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          {selectedLocation ? 'Change Location' : 'Select Location on Map'}
        </Button>
        {selectedLocation && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selected:</strong> {selectedLocation.address}
            </p>
            <p className="text-xs text-blue-600">
              Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <p className="text-gray-600 font-medium">Interactive Map</p>
            <p className="text-sm text-gray-500">Click to select issue location</p>
          </div>
          <div className="space-x-2">
            <Button onClick={handleLocationClick} size="sm">
              Select This Location
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsMapVisible(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Map integration placeholder - integrate with Leaflet or Mapbox for production
      </p>
    </div>
  );
};

export default IssueMap;
