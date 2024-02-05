const mapStyle = [
  {
    stylers: [
      {
        lightness: 15,
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ebebeb',
      },
      {
        saturation: -5,
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#cccccc',
      },
    ],
  },
  {
    featureType: 'landscape.natural.landcover',
    stylers: [
      {
        color: '#dee8e2',
      },
      {
        saturation: 5,
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.business',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#d6e6dc',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#d7eee0',
      },
    ],
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#d6e6dc',
      },
    ],
  },
  {
    featureType: 'water',
    stylers: [
      {
        saturation: 5,
      },
    ],
  },
];
export default mapStyle;
