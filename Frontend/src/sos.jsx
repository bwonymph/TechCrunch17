import React from "react";
import {mq, satori, pier48sf} from "./globals";


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
            markerText : null,
            mounted : true
        };
    }

    componentDidMount(){
        this.map();
        this.getSignals();
        this.setState({
            mounted : true
        });
    }
    componentWillUnmount() {
        this.setState({mounted:false});
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
            L.mapquest.key = mq.key;

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
        let self = this;
        let client = new RTM(satori.endpoint, satori.appkey);
        client.on('enter-connected', function () {
            console.log('Connected to Satori RTM!');
        });

        client.on('error', function (error) {
            console.log('Failed to connect', error);
        });

        client.start();

        let help = client.subscribe('help', RTM.SubscriptionMode.SIMPLE);
        let phoneSpoof = client.subscribe('phoneSpoof', RTM.SubscriptionMode.SIMPLE);
        
        
        help.on('rtm/subscription/data', handler);
        phoneSpoof.on('rtm/subscription/data', handler);

        function handler(pdu) {
            if(self.state.mounted){
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
    }
    getNewMarker(coords, symbol, msg=null){
        let self = this;
        let marker;
        if(msg){
            console.log("got message");
            marker = L.marker(coords, {
                icon: L.mapquest.icons.flag({
                    primaryColor: getRandomColor(),
                    secondaryColor: getRandomColor(),
                    shadow: true,
                    size: 'lg',
                    symbol: msg.replace(/[^a-z0-9]/gi, '').substring(0,5),
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
            /*
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
            */
            self.renderDirections(marker, e.latlng);
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
    renderDirections(marker, latlng){
        let self = this;
        let llStart = L.latLng(this.state.center);
        L.mapquest.directions().route({
            start: llStart,
            end: latlng,
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
    }
    render(){
        let self = this;
        return (
            <div id="map-container">
                {
                    this.state.directionsLayer && 
                    <div id="direction-cancel" onClick={()=>this.cancelDirections()}>
                        <i className="material-icons large red">close</i>
                    </div>
                }     
                {
                    this.state.markerText 
                    ?
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
                    :
                    <div id="total-text">
                        <div className="collection">
                            {this.state.peers.map((p, i)=>{
                                if(p.extraData.msg){
                                    return (
                                        <div key={i} onClick={()=>routeToPeer()}>
                                            <div className="collection-item">{p.extraData.msg}</div>
                                        </div>
                                    );
                                    function routeToPeer(){
                                        console.log(p.marker);
                                        console.log(p.extraData);
                                        let coords = L.latLng([p.extraData.lat, p.extraData.lon]);
                                        self.renderDirections(p.marker, coords);
                                    }
                                }
                            })}
                        </div>
                    </div>
                }         
                <div id="map"></div>
            </div>
        );
    }
}

module.exports = SOS;