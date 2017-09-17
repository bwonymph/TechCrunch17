import React from 'react';
import {mq, satori, pier48sf} from "./globals";

class Help extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            center : pier48sf,
            input : ""
        };
    }

    componentDidMount(){
        this.map();
        this.connect();
    }

    connect(){
        let client = new RTM(satori.endpoint, satori.appkey);
        client.on('enter-connected', function () {
            console.log('Connected to Satori RTM!');
        });

        client.on('error', function (error) {
            console.log('Failed to connect', error);
        });

        client.start();

        this.setState({
            client : client
        });
    }
    sendSignal(){
        let message = {
          lat: this.state.center[0],
          lon: this.state.center[1],
          msg: this.state.input
        };
        this.state.client.publish("help", message , function (pdu) {
          if (pdu.action === 'rtm/publish/ok') {
            console.log('Publish confirmed');
          } else {
            console.log('Failed to publish. RTM replied with the error  ' +
                pdu.body.error + ': ' + pdu.body.reason);
          }
        });
    }

    map(){
        let self = this;

        L.mapquest.key = mq.key;
        // 'map' refers to a <div> element with the ID map
        let map = L.mapquest.map('map', {
            center: self.state.center,
            layers: L.mapquest.tileLayer('map'),
            zoom: 12
        });
        map.addControl(L.mapquest.control({
            position : "topleft"
        }));
        let trafficLayer = L.mapquest.trafficLayer();
        map.addLayer(trafficLayer);
        

        L.marker(self.state.center, {
            icon: L.mapquest.icons.via({
                primaryColor: '#47adf8',
                secondaryColor: '#ffffff',
                shadow: true,
                size: 'lg'
            })
        }).addTo(map);

        self.setState({
            map : map,
            trafficLayer : trafficLayer
        });
    }


    render(){
        let self = this;
        return (
            <div id="map-container">
                <div id="direction-cancel" className="input-field">
                    <input type="text" onChange={inputChanged} className="validate" placeholder="message"/>
                    <button className="waves-effect waves-light btn" onClick={()=>this.sendSignal()}>Submit</button>
                </div>
                <div id="map"/>
            </div>
        );
        function inputChanged(evt){
            self.setState({
                input : evt.currentTarget.value
            });
            console.log(self.state.input);
        }
    }
}

module.exports = Help;