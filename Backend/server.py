#server.py

import nexmo

client = nexmo.Client(key='d4f97f0e', secret='2e02d0a63e14517f')

# client = nexmo.Client(application_id='a7759aa3-88ef-4bcf-abc3-3c0334cec861', private_key= './private.key')

response = client.send_message({'from': '12012413501', 'to': '19169908919', 'text': 'Are you in a Safe location? What is your location?'})

response = response['messages'][0]

if response['status'] == '0':
  print 'Sent message', response['message-id']

  print 'Remaining balance is', response['remaining-balance']
else:
  print 'Error:', response['error-text']

# response = client.create_call({
#   'to': [{'type': 'phone', 'number': '19169908919'}],
#   'from': {'type': 'phone', 'number': '12012413501'},
#   'answer_url': ['https://nexmo-community.github.io/ncco-examples/first_call_talk.json']
# })
