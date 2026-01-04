import urllib.request, json, urllib.error
base='http://127.0.0.1:5000/api'

def post(path, data, token=None):
    headers={'Content-Type':'application/json'}
    if token:
        headers['Authorization']='Bearer '+token
    req=urllib.request.Request(base+path, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        resp=urllib.request.urlopen(req)
        print(path, '->', resp.getcode())
        print(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(path, 'ERROR', e.code)
        print(e.read().decode())

# login pro
req=urllib.request.Request(base+'/auth/login', data=json.dumps({'email':'test_pro@example.com','password':'password123'}).encode('utf-8'), headers={'Content-Type':'application/json'})
resp=urllib.request.urlopen(req)
pro=json.loads(resp.read())
pro_token=pro['token']
print('pro token ok')

# login client
req=urllib.request.Request(base+'/auth/login', data=json.dumps({'email':'test_client@example.com','password':'password123'}).encode('utf-8'), headers={'Content-Type':'application/json'})
resp=urllib.request.urlopen(req)
cli=json.loads(resp.read())
cli_token=cli['token']
print('client token ok')

# pro invites client
post('/connection/invite-client', {'client_email':'test_client@example.com'}, token=pro_token)

# list connections (pro)
req=urllib.request.Request(base+'/connection/list', headers={'Authorization':'Bearer '+pro_token})
resp=urllib.request.urlopen(req)
print('/connection/list pro ->', resp.getcode())
print(resp.read().decode())

# list connections (client)
req=urllib.request.Request(base+'/connection/list', headers={'Authorization':'Bearer '+cli_token})
resp=urllib.request.urlopen(req)
print('/connection/list client ->', resp.getcode())
print(resp.read().decode())
