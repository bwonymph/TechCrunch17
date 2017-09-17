#check backend
from __future__ import print_function
from satori.rtm.client import make_client, SubscriptionMode
from sparkpost import SparkPost
# from FlowrouteMessagingLib.Models.Message import Message
# from FlowrouteMessagingLib.Controllers.APIController import APIController    

# from googleapiclient.discovery import build
from google.cloud import translate


import urllib2
import json 
import time
import sys

#API 
reload(sys)
sys.setdefaultencoding('utf8')

#API endpoints for Satori
endpoint = "wss://"
appkey = ""

global timer2 
global name_dir

timer2 = 0



url = urllib2.urlopen("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.565068,-122.322448&radius=50000&type=hospital&keyword=kasier&key=AIzaSyD7VsS765wmLmGAzbnzit0sk_dB_wFULDI")
data = json.loads(url.read().decode())

test = data["results"][1]["name"]
    # test2 = data["results"][1]["geometry"]['location']['lat']
    # test3 = data["results"][1]["geometry"]['location']['lng']
test4= data["results"][1]["place_id"]


test1 = data["results"][2]["name"]
#     test12 = data["results"][2]["geometry"]['location']['lat']
#     test13 = data["results"][2]["geometry"]['location']['lng']
test14= data["results"][2]["place_id"]

test2 = data["results"][3]["name"]
#     test22 = data["results"][3]["geometry"]['location']['lat']
#     test23 = data["results"][3]["geometry"]['location']['lng']
test24= data["results"][3]["place_id"]

#Input location data taken into google map api to get the route_time in real time traffic

url = urllib2.urlopen("https://maps.googleapis.com/maps/api/directions/json?origin=sacramento&destination=place_id:%s&key=AIzaSyD7VsS765wmLmGAzbnzit0sk_dB_wFULDI"%test4)
data = json.loads(url.read().decode())

route_time = data["routes"][0]["legs"][0]["duration"]["value"]
timer2 = route_time

url = urllib2.urlopen("https://maps.googleapis.com/maps/api/directions/json?origin=sacramento&destination=place_id:%s&key=AIzaSyD7VsS765wmLmGAzbnzit0sk_dB_wFULDI"%test14)
data = json.loads(url.read().decode())

route_time = data["routes"][0]["legs"][0]["duration"]["value"]
timer3 = route_time

url = urllib2.urlopen("https://maps.googleapis.com/maps/api/directions/json?origin=sacramento&destination=place_id:%s&key=AIzaSyD7VsS765wmLmGAzbnzit0sk_dB_wFULDI"%test24)
data = json.loads(url.read().decode())

route_time = data["routes"][0]["legs"][0]["duration"]["value"]
timer4 = route_time

print(route_time) #check route_time parse

global timeradd1
global timeradd2

#hospital Stream 1
class SubscriptionObserver(object):
    def on_enter_subscribed(self):
        print('Subscribed to: service1')

    def on_subscription_data(self, pdu):
        for service1 in pdu['messages']:
            print('Got time {0}: {1}'.format(service1['time'], service1))
            global timeradd1
            timeradd1 = service1['time']


    def on_enter_failed(self, reason):
        print('Subscription failed:', reason, file=sys.stderr)

with make_client(endpoint=endpoint, appkey=appkey) as client:
    print('Connected to Satori RTM!')
    observer = SubscriptionObserver()
    client.subscribe('service1', SubscriptionMode.SIMPLE, observer)
    count = 0
    try:
        while count != 7 :
            time.sleep(1)
            count = count +1 
    except KeyboardInterrupt:
        pass

class SubscriptionObserver(object):
    def on_enter_subscribed(self):
        print('Subscribed to: hospital2')

    def on_subscription_data(self, pdu):
        for service2 in pdu['messages']:
            print('Got time {0}: {1}'.format(service2['time'], service2))
            global timeradd2
            timeradd2 = service2['time']


    def on_enter_failed(self, reason):
        print('Subscription failed:', reason, file=sys.stderr)

with make_client(endpoint=endpoint, appkey=appkey) as client:
    print('Connected to Satori RTM!')
    observer = SubscriptionObserver()
    client.subscribe('hospital1', SubscriptionMode.SIMPLE, observer)
    count = 0
    try:
        while count != 9 :
            time.sleep(1)
            count = count +1 
    except KeyboardInterrupt:
        pass


timer2 = timer2 + int(timeradd1)
timer3 = timer3 + int(timeradd2)

if(timer2 > timer3):
	name_dir = test4

else:
	name_dir = test14


print(timer2)


 
sparky = SparkPost('d50127c96fc6c8bf5ffca5e35e18bf71d3c2cf1b') #Begin sparkpost API
 
# #Translation services for text
# translate_client = translate.Client()

#     # The text to translate
# translation = u'Help this is my symptoms, I have a sore throat'
#     # The target language
# target = 'es' #spanish

#     # Translates some text into target
# text = translate_client.translate(
#     translation,
#     target_language=target)

text = 'Emergency services are on their way 5 min'

response = sparky.transmissions.send( #Send email to emergency services/doctor for prognosis
    use_sandbox=True,
    recipients=[''],
    html='<html><body><p>%s'%text,
    from_email='localpart@sparkpostbox.com',
    subject='Service Update!')


def send_final():
    with make_client(endpoint=endpoint, appkey=appkey) as client:
        print('Connected to Satori RTM!')
        count = 0

        while True:

            def on_publish_ack(pdu):
                if pdu['action'] == 'rtm/publish/ok':
                    print('Publish confirmed')
                else:
                    print(
                        'Failed to publish. '
                        'RTM replied with the error {0}: {1}'.format(
                            pdu['body']['error'], pdu['body']['reason']))

            global name_dir
            
            message = {"place_id": name_dir}
            json.dumps(data)
            client.publish("output", message, callback=on_publish_ack)

            time.sleep(1)
            # count = count+1


send_final()












