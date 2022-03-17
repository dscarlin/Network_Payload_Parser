class SalesforceNetworkResponse{
  constructor(jsonStr, shouldParse){
    this.jsonStr = jsonStr;
    this.shouldParse = shouldParse;
  }
  get data_payload(){
    const inputNode = JSON.parse(typeof this.jsonStr === 'string' && this.jsonStr || '""');
    const firstAction = inputNode.actions?.[0]
    let payload;


    //Initial params from parsing input node 
    const paramsJSON = firstAction?.params?.params?.parametersJSON;
    const dataSourceMap = firstAction?.params?.params?.dataSourceMap;
    const input = firstAction?.params?.params?.input;
    const returnValue = firstAction?.returnValue?.returnValue;

    const errorMessage = this.shouldParse ?  '{ \"Error\": \"Did not find Your value\"}' : '';

    switch(true){
      case !!paramsJSON:                              //getDataHandler
          payload = paramsJSON;
          break;
      case !!dataSourceMap:                           //  
          payload = dataSourceMap;
          break;
      case !!input:                                   //Integration Procedure
          payload = input;
          break;
      case !!returnValue:                             //response
          payload = returnValue;
          break;
      default:
          payload = errorMessage;
    }
    const parsed = JSON.parse(payload || '{}');
    
    //Secondary set of params from parsing initial param node
    const inputMap = parsed?.value?.inputMap && typeof parsed.value.inputMap === 'string' ? parsed.value.inputMap : null;
    const drParams = parsed?.DRParams && typeof parsed.DRParams === 'object' ? JSON.stringify(parsed.DRParams) : null;

    switch(true){
      case !!inputMap:                                    
          payload = inputMap;
          break;
      case !!drParams:                                    //Dataraptor   
          payload = drParams;
          break;
      default:
          break;
    }
    
    return payload;
  }
}
