from flask import Flask, jsonify, request, send_from_directory
import pymysql
import requests
import sys
import time

HOST_NAME = '127.0.0.1'
DB_PORT = 5520
APP_PORT = 5521
APP_NODE_NAME = "UNKNOWN"

app = Flask(__name__,static_url_path='')

def selectAllOffers(conn):
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("SELECT * FROM irs_contract_proposal WHERE STATUS <> 'MATCHED'")
        rv = []
        for row in cursor:
            print("Reading Row %s "%row)
            obj = {
                'proposedBy': row["PROPOSED_BY"],
                'contractId': row['CONTRACT_ID'],
                'buyerId': row['BUYER_ID'],
                'sellerId': row['SELLER_ID'],
                'fixedLegRate': str(row['FIXED_LEG_RATE']),
                'floatingRateIndex': row['FLOATING_RATE_INDEX'],
                'spread': str(row['FLOATING_RATE_SPREAD']),
                'notionalAmount': str(row['NOTIONAL_AMOUNT']),
                'startDate': str(row['START_DATE']),
                'maturityDate': str(row['MATURITY_DATE']),
                'couponFreq': str(row['COUPON_FREQUENCY']),
                'status': row['STATUS']
            }
            rv.append(obj)
        return rv
    finally:
        cursor.close()
    pass
    

def selectAllContracts(conn):
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("SELECT * FROM irs_contract")
        rv = []
        for row in cursor:
            obj = {
                'contractId': row['CONTRACT_ID'],
                'buyerId': row['BUYER_ID'],
                'sellerId': row['SELLER_ID'],
                'fixedLegRate': str(row['FIXED_LEG_RATE']),
                'floatingRateIndex': row['FLOATING_RATE_INDEX'],
                'spread': str(row['FLOATING_RATE_SPREAD']),
                'notionalAmount': str(row['NOTIONAL_AMOUNT']),
                'startDate': str(row['START_DATE']),
                'maturityDate': str(row['MATURITY_DATE']),
                'couponFreq': str(row['COUPON_FREQUENCY']),
            }
            rv.append(obj)
        return rv
    finally:
        cursor.close()
    pass
    


def runInConnection(func):
    conn = pymysql.connect(user='thetachain', passwd='thetachain', host=HOST_NAME, db='BLOCKCHAIN',port=DB_PORT)
    try:
        return func(conn)
    finally:
        conn.commit()
        conn.close

@app.route("/api/listOffers")
def listOffers():
    offers = runInConnection(lambda conn: selectAllOffers(conn))
    return jsonify(offers)

@app.route("/api/listContracts")
def listContracts():
    contracts = runInConnection(lambda conn: selectAllContracts(conn))
    return jsonify(contracts)

@app.route("/api/addOffer", methods=['POST'])
def addOffer():
    data = request.json
    print("Add Offer called %s %s \n"%(data["buyerId"],data["sellerId"]))
    if (data["buyerId"] != APP_NODE_NAME) and (data["sellerId"] != APP_NODE_NAME):
        return jsonify({"status":"error","errorMessage":"Neither buyerId=%s or sellerId=%s matches APP_NODE=%s"%(data["buyerId"],data["sellerId"],APP_NODE_NAME)})
    pass 
    d = { "validatingPeers" : [data["buyerId"],data["sellerId"]],"proposal": {
            "moduleId": "irs",
            "contractId": "proposeContract",
            "parameters": data
        } 
    } 
    print(d)
    url = "http://%s:%d/api/runContract"%(HOST_NAME,APP_PORT)
    print("Calling URL ["+url+"]")
    response = requests.post(url, json=d)
    return jsonify(response.json())

@app.route('/api/getSchema')
def getSchema():
    url = "http://%s:%d/api/getSchema"%(HOST_NAME,APP_PORT)
    print("Calling URL ["+url+"]")
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/api/getTable/<tableName>')
def getTable(tableName):
    url = "http://%s:%d/api/getTable/%s"%(HOST_NAME,APP_PORT,tableName)
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/api/getState')
def getState():
    url = "http://%s:%d/api/getState"%(HOST_NAME,APP_PORT)
    response = requests.get(url)
    return jsonify(response.json())


@app.route('/api/getLevelDBDump')
def getLevelDBDump():
    url = "http://%s:%d/api/getLevelDBDump"%(HOST_NAME,APP_PORT)
    response = requests.get(url)
    return jsonify(response.json())

def loadModule(modFile):
    try:
        print("Loading Module %s"%modFile)
        multipart_form_data = {
            'thetaCode': open(modFile, 'rb')
        }
        url = "http://%s:%d/api/loadModule"%(HOST_NAME,APP_PORT)
        requests.post(url, files=multipart_form_data)
        print("Sent LoadModule request for %s"%modFile)
    except:
        pass
    pass
pass

@app.route('/', defaults={'file': 'index.html'})
def sendRoot(file):
    print("SendRoot")
    # Haven't used the secure way to send files yet
    return send_from_directory("static", file)

def loadServerState():
    global APP_NODE_NAME  
    for i in range(0,30):
        try:
            url = "http://%s:%d/api/getState"%(HOST_NAME,APP_PORT)
            resp = requests.get(url).json()
            if resp["status"] != "success":
                raise Exception("Could not get a valid STATE from the server @ %s -> %s "%(url,resp))
            else:
                APP_NODE_NAME = resp["returnValue"]["NodeName"]
                #print("Got Node Name as %s"%APP_NODE_NAME)
            pass
            break
        except:
            pass
        pass
        print >>sys.stderr, "Server Not Up Yet. Retrying in 5 seconds\n"
        time.sleep(5)
    pass
pass


if __name__ == '__main__':
    port = int(sys.argv[1])
    HOST_NAME = sys.argv[2]
    DB_PORT = int(sys.argv[3])
    APP_PORT = int(sys.argv[4])
    loadServerState()
    print("Starting server with @ %d connected to %s:%d:%d with name %s "%(port,HOST_NAME,DB_PORT,APP_PORT,APP_NODE_NAME))
    if len(sys.argv) > 5:
        for x in range(5,len(sys.argv)):
            loadModule(sys.argv[x])
        pass
    pass
    app.run(host='0.0.0.0',port=port)
