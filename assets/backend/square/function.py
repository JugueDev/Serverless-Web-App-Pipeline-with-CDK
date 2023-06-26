
def handler(event, context):
    '''Provide an event that contains the following keys:
      - operation: -
    '''
    print(event)

    response = {
    "statusCode": "200",
    "headers": { "table": "table"},
    "body": "body"
    }   
    return response