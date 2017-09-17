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
            map : null
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
            map.addLayer(L.mapquest.trafficLayer());

            L.marker(self.state.center, {
                icon: L.mapquest.icons.marker({
                    primaryColor: '#22407F',
                    secondaryColor: '#3B5998',
                    shadow: true,
                    size: 'md',
                    symbol: 'A'
                })
            }).addTo(map);

            self.setState({
                map : map
            });
        }
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

        let channel = client.subscribe('phoneSpoof', RTM.SubscriptionMode.SIMPLE);

        /* set callback for PDU with specific action */
        channel.on('rtm/subscription/data', function (pdu) {
            pdu.body.messages.forEach(function (msg) {
                console.log(msg);
                let coords = [msg.lat, msg.lon];
                let marker = getNewMarker(coords, self.state.peers.length + 1);
                console.log(marker);
                marker.addTo(self.state.map);
                self.setState({
                    peers : [...self.state.peers, msg]
                });
            });
        });

        function getNewMarker(coords, symbol){
            let marker = L.marker(coords, {
                    icon: L.mapquest.icons.marker({
                        primaryColor: getRandomColor(),
                        secondaryColor: getRandomColor(),
                        shadow: true,
                        size: 'md',
                        symbol: symbol,
                        riseOnHover : true
                    })
                });
            marker.on('click', (e)=>{
                let llStart = L.latLng(self.state.center);
                L.mapquest.directions().route({
                    start: llStart,
                    end: e.latlng
                }, (error, response) => {
                    L.mapquest.directionsLayer({
                        directionsResponse : response
                    }).addTo(self.state.map);
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
    }
    render(){
        return (
            <div>
                <div id="map"></div>
            </div>
        );
    }
}

module.exports = SOS;