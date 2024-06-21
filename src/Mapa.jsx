import { useEffect, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Row, Col } from 'react-bootstrap';


const primers = [
    {
        "adr": "figueres",
        "lat": 42.2667,
        "long": 2.9667
    },
    {
        "adr": "molina",
        "lat": 42.3427392,
        "long": 1.9562059
    },
    {
        "adr": "girona",
        "lat": 41.9842,
        "long": 2.8239
    }
]


function DisplayPosition({ map }) {
    const [position, setPosition] = useState(() => map.getCenter())
    const [bounds, setBounds] = useState(() => map.getBounds())
  
    const onClick = useCallback(() => {
      map.setView(center, zoom)
    }, [map])
  
    const onMove = useCallback(() => {
      setPosition(map.getCenter())
      setBounds(map.getBounds())
      //console.log(map.getBounds())
    }, [map])
  
    useEffect(() => {
      map.on('move', onMove)
      return () => {
        map.off('move', onMove)
      }
    }, [map, onMove])

  
    return (
      <p>
        latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}
        <br />
        {bounds ? 
        `latitude: ${bounds._northEast.lat.toFixed(4)}, longitude: ${bounds._northEast.lng.toFixed(4)}`
        : "xx" }
        

        {' '}

        <button onClick={onClick}>reset</button>
      </p>
    )
  }

  
export default () => {

    const [address, setAddress] = useState('');
    const [center, setCenter] = useState([42.3427392, 1.9562059]);
    const [llocs, setLlocs] = useState(primers);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (!map) return;
        //console.log("limits", map.getBounds())
      }, [map]);


    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(coords);
        }
    }

    function coords(position) {

        console.log("centre", position)
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        setCenter([lat, long]);
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`)
            .then(response => response.json())
            .then(data => {
                console.log("adr", data);
                setAddress(data.display_name);
                setLlocs([...llocs, { "adr": data.display_name, lat, long: long }])
            });
    }

    useEffect(() => {
        getLocation();
    }, [])



    function GestioEventsMapa() {
        const map = useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log("adr", data);
                        setAddress(data.display_name);
                        setCenter([lat, lng])
                        setLlocs([...llocs, { "adr": data.display_name, lat, long: lng }])
                    });
            },
            locationfound: (location) => {
                console.log('location found:', location)
            },
        })
        return null
    }

    const CentraMapa = ({ centre }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(centre);
        }, centre);
        return null;
    }


    useMemo(()=>{

    })

    const marcadors = llocs.map((e, idx) => (
        <Marker key={idx} position={[e.lat, e.long]}>
            <Popup>
                <h1>Hola</h1>
                <img src="http://placekitten.com/100/100" alt="" />
                {e.adr}
            </Popup>
        </Marker>
    ))

    return (
        <>

            <h1>mapa</h1>
            {address}
            <hr />
            <Row>
                <Col >

                    <MapContainer
                        className="el-puto-mapa"
                        center={center}
                        zoom={10}
                        scrollWheelZoom={true}
                        ref={setMap}
                    >
                        <CentraMapa centre={center} />
                        <GestioEventsMapa />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {marcadors}
                    </MapContainer>
                    {map ? <DisplayPosition map={map} /> : null}
                </Col>

            </Row>


        </>
    )
}