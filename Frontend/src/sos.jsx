import React from "react";

const mp = {
    key : "QwMOrkHNGKtPozliUHoqCWalFbaJG8mp",
    secret : "mjwQ3vrwawdn9VGG"
};
const satori = {
    endpoint : "wss://h0j3zwoo.api.satori.com",
    appkey : "d3fE5A8bc1D9C2e8761DfCf7d6cab13a"
};
const pier48sf = [37.77562,-122.386737];

class SOS extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            peers : [],
            center : pier48sf,
            map : null,
            trafficLayer : null,
            incidentsLayer : null,
            directionsLayer : null,
            markerText : null
        };
    }
    componentDidMount(){
        this.map();
        this.getSignals();
    }
    setCurrentLocation(){
        let self = this;
        navigator.geolocation.getCurrentPosition((position)=>{
            let coords = [position.coords.latitude, position.coords.longitude];
            console.log(coords);
            self.setState({
                center : coords
            });
        });
    }
    map(){
        let self = this;
        renderMap();
        function renderMap(){
            let L = window.L;
            L.mapquest.key = mp.key;

            // 'map' refers to a <div> element with the ID map
            let map = L.mapquest.map('map', {
                center: self.state.center,
                layers: L.mapquest.tileLayer('map'),
                zoom: 12
            });

            /*
            Add controls
            */
            map.addControl(L.mapquest.control({
                position : "topleft"
            }));

            /*
            Add layers
            */
            let trafficLayer = L.mapquest.trafficLayer();
            let incidentsLayer = L.mapquest.incidentsLayer();
            map.addLayer(trafficLayer);
            //map.addLayer(incidentsLayer);
            

            L.marker(self.state.center, {
                icon: L.mapquest.icons.via({
                    primaryColor: '#47adf8',
                    secondaryColor: '#ffffff',
                    shadow: true,
                    size: 'lg'
                })
            }).addTo(map);

            /*
            self.state.peers.forEach((p, i) => {
                getNewMarker([p.lat, p.lon], i).addTo(map);
            });
            */

            self.setState({
                map : map,
                trafficLayer : trafficLayer,
                incidentsLayer : incidentsLayer
            });
        }
    }

    cancelDirections(){
        this.state.map.addLayer(this.state.trafficLayer);
        this.state.map.removeLayer(this.state.directionsLayer);
        this.setState({
            markerText : null
        });
    }

    getSignals(){
        let client = new RTM(satori.endpoint, satori.appkey);
        let self = this;
        client.on('enter-connected', function () {
            console.log('Connected to Satori RTM!');
        });

        client.on('error', function (error) {
            console.log('Failed to connect', error);
        });

        client.start();

        let helpChannel = client.subscribe('help', RTM.SubscriptionMode.SIMPLE);
        let phoneSpoofChannel = client.subscribe('phoneSpoof', RTM.SubscriptionMode.SIMPLE);

        /* set callback for PDU with specific action */
        helpChannel.on('rtm/subscription/data', handler);
        phoneSpoofChannel.on('rtm/subscription/data', handler);

        function handler(pdu) {
            pdu.body.messages.forEach(function (msg) {
                console.log(msg);
                let coords = [msg.lat, msg.lon];
                let marker = self.getNewMarker(coords, self.state.peers.length + 1, msg.msg);
                marker.addTo(self.state.map);
                let peer = {
                    marker : marker,
                    extraData : msg
                };
                self.setState({
                    peers : [...self.state.peers, peer]
                });
            });
        }
    }
    getNewMarker(coords, symbol, msg=null){
        let self = this;
        let marker;
        if(msg){
            marker = L.marker(coords, {
                icon: L.mapquest.icons.flag({
                    primaryColor: getRandomColor(),
                    secondaryColor: getRandomColor(),
                    shadow: true,
                    size: 'lg',
                    symbol: msg.substring(0,5),
                    riseOnHover : true
                })
            });
            marker.extraData = msg;
        } else {
            marker = L.marker(coords, {
                icon: L.mapquest.icons.marker({
                    primaryColor: getRandomColor(),
                    secondaryColor: getRandomColor(),
                    shadow: true,
                    size: 'sm',
                    symbol: symbol,
                    riseOnHover : true
                })
            });
        }
        
        marker.on('click', (e)=>{
            let llStart = L.latLng(self.state.center);
            L.mapquest.directions().route({
                start: llStart,
                end: e.latlng,
                routeRibbon : {
                    opacity : 1.0
                },
                alternateRouteRibbon : {
                    opacity : 0.8
                }
            }, (error, response) => {
                let directionsLayer = L.mapquest.directionsLayer({
                    directionsResponse : response
                });
                self.setState({
                    directionsLayer : directionsLayer,
                    markerText : marker.extraData
                });
                directionsLayer.addTo(self.state.map);
                self.state.map.removeLayer(self.state.trafficLayer);                    
            });
        });
        return marker;
        function getRandomColor(){
            let color = "#";
            for(let i = 0; i < 3; i++){
                let val = (Math.floor(Math.random() * 255)).toString(16);
                if(val.length == 1) val = "0" + val;
                color += val;
            }
            return color;
        }
    }
    render(){
        return (
            <div id="map-container">
                {
                    this.state.directionsLayer && 
                    <div id="direction-cancel" onClick={()=>this.cancelDirections()}>
                        <i className="material-icons large red">close</i>
                    </div>
                }     
                {
                    this.state.markerText &&
                    <div id="marker-text">
                        <div className="card blue">
                            <div className="card-content white-text">
                                <span className="card-title">SOS Text</span>
                                <p>{this.state.markerText}</p>
                            </div>
                            <div className="card-action">
                                <a href="#">This is a link</a>
                                <a href="#">This is a link</a>
                            </div>
                        </div>
                    </div>
                }         
                <div id="map"></div>
            </div>
        );
    }
}

module.exports = SOS;