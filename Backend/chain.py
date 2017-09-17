import hashlib, json, sys

from __future__ import print_function

import time

from satori.rtm.client import make_client


############## EXPLANATION #####################

#This is a localized blockchain which keeps track of individuals which call the service.
#For the sake of this project, there are 4 individuals here, Alice, Bob, Charles and Derek. 
#Each individual is assigned one coin, which represenets that they are saved. Once they call into the system,
#They give their coin to Eservice address, which holds all coins from every individual. Once someone is saved, 
#they are given back their coin/token. In this manner, if the Eservice entity is holding onto any amount of coins,
#then there are people out there that needs to be saved. More blocks can be mined, as more people join the service. 

#All blocks are verified and transactions are validated before moving into the chain in case of discrepancies or overdraft issues. 
#Transactions are published to the Satori stream 


endpoint = "wss://h0j3zwoo.api.satori.com"
appkey = "d3fE5A8bc1D9C2e8761DfCf7d6cab13a"

#Satori Stream functions

def publish():

    def on_publish_ack(pdu):
        if pdu['action'] == 'rtm/publish/ok':
            print('Publish confirmed')
        else:
            print(
                  	'Failed to publish. '
               	    'RTM replied with the error {0}: {1}'.format(
        	            pdu['body']['error'], pdu['body']['reason']))

    message = {"msg": "Person Saved", "lat": "37.7757407", "lon": "-122.38955"}
    client.publish("saveChannel", message, callback=on_publish_ack)


#Block Chain Functions


def hashMe(msg=""):
    if type(msg)!=str:
        msg = json.dumps(msg,sort_keys=True)  #sort keys
        
    if sys.version_info.major == 2:
        return unicode(hashlib.sha256(msg).hexdigest(),'utf-8')
    else:
        return hashlib.sha256(str(msg).encode('utf-8')).hexdigest()


import random
random.seed(0)

def makeTransaction(maxValue=3):
    # Valid transactions in the range of (1,maxValue)
    sign      = int(random.getrandbits(1))*2 - 1   # This will randomly choose -1 or 1
    # amount    = random.randint(1,maxValue)
    amount    = 1
    alicePays = sign * amount
    eservicePays   = -1 * alicePays
    derekPays = sign * amount
    eservicePays = -1 * derekPays

    publish() #Update Satori channel

    # Need overdraft check
    return {u'Eservice':eservicePays,u'Bob':bobPays, u'Alice':alicePays, u'Charles':charlesPays,u'Derek':derekPays}


txnBuffer = [makeTransaction() for i in range(30)]


def updateState(txn, state):
    # Inputs: txn, state: dictionaries keyed with account names, holding numeric values for transfer amount (txn) or account balance (state)
    # Returns: Updated state, with additional users added to state if necessary
    
    # If the transaction is valid, then update the state
    state = state.copy() 
    for key in txn:
        if key in state.keys():
            state[key] += txn[key]
        else:
            state[key] = txn[key]
    return state

def isValidTxn(txn,state):
    # Assume that the transaction is a dictionary keyed by account names

    if sum(txn.values()) is not 0:
        return False
    
    # Check that the transaction does not cause an overdraft
    for key in txn.keys():
        if key in state.keys(): 
            acctBalance = state[key]
        else:
            acctBalance = 0
        if (acctBalance + txn[key]) < 0:
            return False
    
    return True

def makeBlock(txns,chain):
    parentBlock = chain[-1]
    parentHash  = parentBlock[u'hash']
    blockNumber = parentBlock[u'contents'][u'blockNumber'] + 1
    txnCount    = len(txns)
    blockContents = {u'blockNumber':blockNumber,u'parentHash':parentHash,
                     u'txnCount':len(txns),'txns':txns}
    blockHash = hashMe( blockContents )
    block = {u'hash':blockHash,u'contents':blockContents}
    
    return block

def checkBlockHash(block):
    # Raise an exception if the hash does not match the block contents
    expectedHash = hashMe( block['contents'] )  
    if block['hash']!=expectedHash:
        raise Exception('Hash does not match contents of block %s'%
                        block['contents']['blockNumber'])
    return

def checkBlockValidity(block,parent,state):    
    # We want to check the following conditions:
    # - Each of the transactions are valid updates to the system state
    # - Block hash is valid for the block contents
    # - Block number increments the parent block number by 1
    # - Accurately references the parent block's hash
    parentNumber = parent['contents']['blockNumber']
    parentHash   = parent['hash']
    blockNumber  = block['contents']['blockNumber']
    
    # Check transaction validity; throw an error if an invalid transaction was found.
    for txn in block['contents']['txns']:
        if isValidTxn(txn,state):
            state = updateState(txn,state)
        else:
            raise Exception('Invalid transaction in block %s: %s'%(blockNumber,txn))

    checkBlockHash(block) # Check hash integrity; raises error if inaccurate

    if blockNumber!=(parentNumber+1):
        raise Exception('Hash does not match contents of block %s'%blockNumber)

    if block['contents']['parentHash'] != parentHash:
        raise Exception('Parent hash not accurate at block %s'%blockNumber)
    
    return state
def checkChain(chain):
    # Work through the chain from the genesis block (which gets special treatment), 
    #  checking that all transactions are internally valid,
    #    that the transactions do not cause an overdraft,
    #    and that the blocks are linked by their hashes.
    # This returns the state as a dictionary of accounts and balances,
    #   or returns False if an error was detected

    
    ## Data input processing: Make sure that our chain is a list of dicts
    if type(chain)==str:
        try:
            chain = json.loads(chain)
            assert( type(chain)==list)
        except:  # This is a catch-all, admittedly crude
            return False
    elif type(chain)!=list:
        return False
    
    state = {}
    ## Prime the pump by checking the genesis block
    # We want to check the following conditions:
    # - Each of the transactions are valid updates to the system state
    # - Block hash is valid for the block contents

    for txn in chain[0]['contents']['txns']:
        state = updateState(txn,state)
    checkBlockHash(chain[0])
    parent = chain[0]
    
    ## Checking subsequent blocks: These additionally need to check
    #    - the reference to the parent block's hash
    #    - the validity of the block number
    for block in chain[1:]:
        state = checkBlockValidity(block,parent,state)
        parent = block
        
    return state


state = {u'Alice':1, u'Bob':1, u'Eservice':0, u'Charles':1,u'Derek':1}  # Define the initial state
#Eservice has 0 because it has no emergency to take care of, if it is >0 then there is people to be saved. 
genesisBlockTxns = [state]
genesisBlockContents = {u'blockNumber':0,u'parentHash':None,u'txnCount':1,u'txns':genesisBlockTxns}
genesisHash = hashMe( genesisBlockContents )
genesisBlock = {u'hash':genesisHash,u'contents':genesisBlockContents}
genesisBlockStr = json.dumps(genesisBlock, sort_keys=True)


chain = [genesisBlock]

blockSizeLimit = 2  # Arbitrary number of transactions per block- 
               #  this is chosen by the block miner, and can vary between blocks!

while len(txnBuffer) > 0:
    bufferStartSize = len(txnBuffer)
    
    ## Gather a set of valid transactions for inclusion
    txnList = []
    while (len(txnBuffer) > 0) & (len(txnList) < blockSizeLimit):
        newTxn = txnBuffer.pop()
        validTxn = isValidTxn(newTxn,state) # This will return False if txn is invalid
        
        if validTxn:           # If we got a valid state, not 'False'
            txnList.append(newTxn)
            state = updateState(newTxn,state)
        else:
            print("ignored transaction")
            sys.stdout.flush()
            continue  # This was an invalid transaction; ignore it and move on
        
    ## Make a block
    myBlock = makeBlock(txnList,chain)
    chain.append(myBlock)





###############################################################################################################


###This is to verify block chain when adding new users. Need to be moved to separate file

import copy
nodeBchain = copy.copy(chain)
nodeBtxns  = [makeTransaction() for i in range(5)]
newBlock   = makeBlock(nodeBtxns,nodeBchain)

print("Blockchain on Node A is currently %s blocks long"%len(chain))

try:
    print("New Block Received; checking validity...")
    state = checkBlockValidity(newBlock,chain[-1],state) # Update the state- this will throw an error if the block is invalid!
    chain.append(newBlock)
except:
    print("Invalid block; ignoring and waiting for the next block...")

print("Blockchain on Node A is now %s blocks long"%len(chain))
print(chain[1])
print(state)

