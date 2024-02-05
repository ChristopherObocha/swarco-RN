import React from 'react';

import MapView from 'components/map/map-view';

const MapScreen = (props: any) => {
  const position = props?.route?.params?.position;
  const selectedSite = props?.route?.params?.selectedSite;
  const locationSearchValue = props?.route?.params?.locationSearchValue;

  return (
    <MapView
      searchPosition={position}
      selectedSite={selectedSite}
      locationSearchValue={locationSearchValue}
    />
  );
};

export default MapScreen;
