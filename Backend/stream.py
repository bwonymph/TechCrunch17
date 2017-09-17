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

            message = {"lat": "37.77493", "lon": "-122.419416","alert":"3"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.768001", "lon": "-122.446747","alert":"2"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.756126", "lon": "-122.433615","alert":"3"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.751478", "lon": "-122.437177","alert":"1"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.749815", "lon": "-122.417908","alert":"3"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.755244", "lon": "-122.396107","alert":"2"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.734069", "lon": "-122.392845","alert":"3"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(5)
            message = {"lat": "37.752665", "lon": "-122.480221","alert":"1"}
            client.publish("phoneSpoof", message, callback=on_publish_ack)
            time.sleep(20)




if __name__ == '__main__':
    main()
