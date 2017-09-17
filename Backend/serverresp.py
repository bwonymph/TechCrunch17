#serverresp.py
# from __future__ import print_function
import time
from satori.rtm.client import make_client, SubscriptionMode

import nexmo
import time

endpoint = "wss://.apisatori.com"
appkey = ""




class SubscriptionObserver(object):
    def on_enter_subscribed(self):
        print('Subscribed to: help')

    def on_subscription_data(self, pdu):
        for service1 in pdu['messages']:
            client = nexmo.Client(key='', secret='')
            response = client.send_message({'from': '', 'to': '', 'text': 'Emergency services are on the way'})

            response = response['messages'][0]

            if response['status'] == '0':
              print 'Sent message', response['message-id']

              print 'Remaining balance is', response['remaining-balance']
            else:
              print 'Error:', response['error-text']



    # def on_enter_failed(self, reason):
    #     print('Subscription failed:', reason, file=sys.stderr)

with make_client(endpoint=endpoint, appkey=appkey) as client:
    print('Connected to Satori RTM!')
    observer = SubscriptionObserver()
    client.subscribe('help', SubscriptionMode.SIMPLE, observer)

    try:
      while True:
        time.sleep(1)
    except KeyboardInterrupt:
        pass
