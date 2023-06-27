
def handler(event, context):
    '''Provide an event that contains the following keys:
      - operation: -
    '''
    print(event)
    body = 0
    
    def isNumeric(s):
        try:
            float(s)
            return True
        except ValueError:
            return False
 
    if isNumeric(event["pathParameters"]["number"]):
      body = float(event["pathParameters"]["number"]) * float(event["pathParameters"]["number"])
    response = {
    "statusCode": "200",
    "headers": { "table": "table"},
    "body": str(body)
    }   
    return response