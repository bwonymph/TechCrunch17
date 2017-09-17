#server.py

import nexmo
import time
from __future__ import print_function
import time
from satori.rtm.client import make_client

global locationem

endpoint = ""
appkey = ""

client = nexmo.Client(key='', secret='')

#client = nexmo.Client(application_id='--', private_key= './private.key')

response = client.send_message({'from': '', 'to': '', 'text': 'Are you in a Safe location? What is your location?'})

response = response['messages'][0]

if response['status'] == '0':
  print 'Sent message', response['message-id']

  print 'Remaining balance is', response['remaining-balance']
else:
  print 'Error:', response['error-text']

time.sleep(10)

class SubscriptionObserver(object): #Get location to go to from mapping 
    def on_enter_subscribed(self):
        print('Subscribed to: locations')

    def on_subscription_data(self, pdu):
        for service1 in pdu['messages']:
            locationem = messages[location]


    def on_enter_failed(self, reason):
        print('Subscription failed:', reason, file=sys.stderr)

with make_client(endpoint=endpoint, appkey=appkey) as client:
    print('Connected to Satori RTM!')
    observer = SubscriptionObserver()
    client.subscribe('locations', SubscriptionMode.SIMPLE, observer)
    count = 0
    try:
        while count != 7 :
            time.sleep(1)
            count = count +1 
    except KeyboardInterrupt:
        pass


response = client.send_message({'from': '', 'to': '', 'text': 'Please head here to meet emergency services'})

response = response['messages'][0]

if response['status'] == '0':
  print 'Sent message', response['message-id']

  print 'Remaining balance is', response['remaining-balance']
else:
	print 'Error:', response['error-text']

time.sleep(2) #need timer to prevent SMS overflow

response = client.send_message({'from': '', 'to': '', 'text': '%s'%locationem})

response = response['messages'][0]

if response['status'] == '0':
  print 'Sent message', response['message-id']

  print 'Remaining balance is', response['remaining-balance']
else:
	print 'Error:', response['error-text']
