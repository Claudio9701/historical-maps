import './App.css';
import {Map} from 'react-map-gl';
import DeckGL, {GeoJsonLayer, BitmapLayer} from 'deck.gl';
import {TileLayer} from '@deck.gl/geo-layers';
import { useState } from 'react';

// Data sources
import LimaMap1735 from './data/Lima1735Render.png'
import LimaBuildings1735 from './data/LimaBuildings1735.geojson'
import LimaWalls1735 from './data/LimaWalls1735.geojson'

const LIMAMAP1879 = 'https://maps.georeferencer.com/georeferences/2408fccd-ee01-4633-b01b-9ee9c8572b44/2022-02-25T00:35:36.413412Z/map/{z}/{x}/{y}.png?key=mtRmpMQUbj3MH9WvjfeU'
const LIMAMAP1872 = 'https://maps.georeferencer.com/georeferences/ea5ac586-8838-4635-8cba-8f4785dde645/2022-02-25T00:35:36.413412Z/map/{z}/{x}/{y}.png?key=mtRmpMQUbj3MH9WvjfeU'

const MAPBOX_ACCES_TOKEN = 'pk.eyJ1IjoiY2xhdWRpbzk3IiwiYSI6ImNqbzM2NmFtMjB0YnUzd3BvenZzN3QzN3YifQ.heZHwQTY8TWhuO0u2-BxxA';

const INITIAL_VIEW_STATE = {
  latitude: -12.05,
  longitude: -77.03,
  zoom: 14,
  bearing: 0,
  pitch: 75
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const NAV_CONTROL_STYLE = {
  position: 'absolute',
  top: 10,
  left: 10
};

function App() {
  const [opacity, setOpacity] = useState(0.3);
  const [hoverInfo, setHoverInfo] = useState({});

  const [osmTile, setOsmTile] = useState(true);
  const [showMap1735, setShowMap1735] = useState(true);
  const [showBuildings1735, setShowBuildings1735] = useState(true);
  const [showWalls1735, setShowWalls1735] = useState(true);
  const [showMap1872, setShowMap1872] = useState(false);
  const [showMap1879, setShowMap1879] = useState(false);



  const layers = [
    new TileLayer({
      id: 'osm-tiles',
      data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',

      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      visible: osmTile,

      renderSubLayers: props => {
        const {
          bbox: {west, south, east, north}
        } = props.tile;
  
        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north]
        });
      }
    }),
    new TileLayer({
      id: 'lima-map-1879',
      data: LIMAMAP1879,

      minZoom: 0,
      maxZoom: 18,
      tileSize: 256,
      opacity: 1,
      visible: showMap1879,

      renderSubLayers: props => {
        const {
          bbox: {west, south, east, north}
        } = props.tile;
  
        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north]
        });
      }
    }),
    new TileLayer({
      id: 'lima-map-1872',
      data: LIMAMAP1872,

      minZoom: 0,
      maxZoom: 18,
      tileSize: 256,
      opacity: 1,
      visible: showMap1872,

      renderSubLayers: props => {
        const {
          bbox: {west, south, east, north}
        } = props.tile;
  
        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north]
        });
      }
    }),
    new BitmapLayer({
      id: 'lima-map-1735',
      opacity: 0.5,
      bounds: [-77.0604469369999947, -12.069618921, -77.00139326, -12.025348549],
      image: LimaMap1735,
      visible: showMap1735,
    }),
    new GeoJsonLayer({
      id: 'buildings1735',
      data: LimaBuildings1735,
      // Styles
      visible: showBuildings1735,
      filled: true,
      opacity: 0.3,
      extruded: true,
      getFillColor: [205, 133, 63],
      getElevation: 30,
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onHover: info => setHoverInfo(info),
    }),
    new GeoJsonLayer({
      id: 'walls1735',
      data: LimaWalls1735,
      // Styles
      visible: showWalls1735,
      filled: true,
      opacity: 0.3,
      extruded: true,
      getFillColor: [237, 201, 175],
      getElevation: 50,
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onHover: info => setHoverInfo(info),
    }),
  ];

  return (
    <div className="App">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCES_TOKEN} />

        {hoverInfo.object && (
        <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y}}>
          { hoverInfo.object.properties.fid }
        </div>
        )}

        <ul>
          <li><button onClick={() => setOsmTile(!osmTile)} style={{backgroundColor:osmTile && 'green'}}>Basemap: OpenStreetMap</button></li>  
          <li>
            <button onClick={() => setShowMap1735(!showMap1735)} style={{backgroundColor:showMap1735 && 'green'}}>1735</button>
            <button onClick={() => setShowWalls1735(!showWalls1735)} style={{backgroundColor:showWalls1735 && 'green'}}>Walls</button>
            <button onClick={() => setShowBuildings1735(!showBuildings1735)} style={{backgroundColor:showBuildings1735 && 'green'}}>Buildings</button>
          </li>
          <li><button onClick={() => setShowMap1872(!showMap1872)} style={{backgroundColor:showMap1872 && 'green'}}>1872</button></li>
          <li><button onClick={() => setShowMap1879(!showMap1879)} style={{backgroundColor:showMap1879 && 'green'}}>1879</button></li>  
          <hr></hr>
        </ul>        
      </DeckGL>
    </div>
  );
}

export default App;
