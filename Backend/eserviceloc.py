from __future__ import print_function

import time

from satori.rtm.client import make_client

endpoint = "wss://h0j3zwoo.api.satori.com"
appkey = "d3fE5A8bc1D9C2e8761DfCf7d6cab13a"

def main():
    with make_client(endpoint=endpoint, appkey=appkey) as client:
        print('Streaming Emergency Service Locations')
        timer = 0


        while True:

            def on_publish_ack(pdu):
                if pdu['action'] == 'rtm/publish/ok':
                    print('Publish confirmed')
                else:
                    print(
                        'Failed to publish. '
                        'RTM replied with the error {0}: {1}'.format(
                            pdu['body']['error'], pdu['body']['reason']))

            message = {"lat": "37.0757407", "lon": "-122.38955","busy":"1"}
            client.publish("eloc", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.7657407", "lon": "-122.35955","busy":"0"}
            client.publish("eloc", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.9757407", "lon": "-122.18955","busy":"0"}
            client.publish("eloc", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.0757407", "lon": "-122.31955","busy":"1"}
            client.publish("eloc", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.0757407", "lon": "-122.13955","busy":"0"}
            client.publish("eloc", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.7557407", "lon": "-122.28955","busy":"1"}
            client.publish("eloc", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.0257407", "lon": "-122.11955","busy":"1"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.6957407", "lon": "-122.12955","busy":"1"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(20)




if __name__ == '__main__':
    main()
