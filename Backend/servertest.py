#server.py

import nexmo
import time

client = nexmo.Client(key='', secret='')

# client = nexmo.Client(application_id='----', private_key= './private.key')

response = client.send_message({'from': '', 'to': '', 'text': 'Are you in a safe location? What is your location?'})

response = response['messages'][0]

if response['status'] == '0':
  print 'Sent message', response['message-id']

  print 'Remaining balance is', response['remaining-balance']
else:
  print 'Error:', response['error-text']

# response = client.create_call({
#   'to': [{'type': 'phone', 'number': ''}],
#   'from': {'type': 'phone', 'number': ''},
#   'answer_url': ['https://nexmo-community.github.io/ncco-examples/first_call_talk.json']
# })

time.sleep(10)


response = client.send_message({'from': '', 'to': '', 'text': 'Please head here to meet emergency services'})

response = response['messages'][0]

if response['status'] == '0':
  print 'Sent message', response['message-id']

  print 'Remaining balance is', response['remaining-balance']
else:
	print 'Error:', response['error-text']

time.sleep(2)

response = client.send_message({'from': '', 'to': '', 'text': 'https://www.google.com/maps/place/San+Francisco+Ferry+Bldg,+1+The+Embarcadero,+San+Francisco,+CA+94105/data=!4m2!3m1!1s0x808580668cd055bb:0x9cbbc099ec82aef7?sa=X&ved=0ahUKEwjuzLbo0KvWAhVPz2MKHclxB84Q8gEIJTAA'})

response = response['messages'][0]

if response['status'] == '0':
  print 'Sent message', response['message-id']

  print 'Remaining balance is', response['remaining-balance']
else:
	print 'Error:', response['error-text']
