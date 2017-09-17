from __future__ import print_function

import time

from satori.rtm.client import make_client

endpoint = ""
appkey = ""

def main():
    with make_client(endpoint=endpoint, appkey=appkey) as client:
        print('Streaming Phone Data')
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

            message = {"lat": "37.7757407", "lon": "-122.38955","alert":"3"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.7657407", "lon": "-122.35955","alert":"2"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.9757407", "lon": "-122.38955","alert":"3"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.2757407", "lon": "-122.31955","alert":"1"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.4757407", "lon": "-122.33955","alert":"3"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.7557407", "lon": "-122.38955","alert":"2"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.6257407", "lon": "-122.31955","alert":"3"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.6957407", "lon": "-122.32955","alert":"1"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(20)




if __name__ == '__main__':
    main()
