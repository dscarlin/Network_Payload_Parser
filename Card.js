class Card{
    constructor(e){
        this.builder_ = CardService.newCardBuilder();
        this.widgets_ = [];
        
        const arrayParamsInputs = {...e.commonEventObject.parameters, ...e.commonEventObject.formInputs}
        for(var key in arrayParamsInputs){
            if(arrayParamsInputs[key].hasOwnProperty('stringInputs'))
            arrayParamsInputs[key] = arrayParamsInputs[key]['stringInputs'].value
            this[key] = Array.isArray(arrayParamsInputs[key]) 
              && arrayParamsInputs[key].length === 1 
              ? arrayParamsInputs[key][0] : arrayParamsInputs[key];
        }
    }
    get sections_(){
        let section;
        return this.widgets_.map(widgetGrouping => 
            (section = CardService.newCardSection(), widgetGrouping.map(widget => section.addWidget(widget)), section)
        );
    }
    get response_(){
        this.sections_.map(section => this.builder_.addSection(section));
        return this.builder_.build()
    }
    action(funcName, parameters, loadIndicator){
        const action = CardService.newAction().setFunctionName(funcName).setParameters(parameters || {})
        if(loadIndicator)
            action.setLoadIndicator(CardService.LoadIndicator.SPINNER)
        return action
    }
    camelCaseToCapitalCase(string){
        return string[0].toUpperCase() + string.slice(1)
    }
    widget(type, options={}){
      // console.log(options)
        type = this.camelCaseToCapitalCase(type)
        const widget = CardService[`new${type}`]()
        // console.log(widget)
        for(let setAction in options){
            const setAction_m = this.camelCaseToCapitalCase(setAction);
            // console.log(setAction)
            if(Array.isArray(options[setAction])){
                options[setAction].map(value => widget[`add${setAction_m}`](value))
            } else {
                // console.log(setAction_m)
                // console.log(options[setAction])
                widget[`set${setAction_m}`](options[setAction])
            }
        }
        return widget
    }
    addWidget(type, options, sectionNumber=1){
        const widget = this.widget(type, options);
        const widgetGrouping = this.widgets_[sectionNumber - 1]
        this.widgets_[sectionNumber - 1] = widgetGrouping || [];
        this.widgets_[sectionNumber - 1].push(widget);
    }
    enum(enumm){
        enumm = this.camelCaseToCapitalCase(enumm).split('.')
        const cat = enumm[0];
        const type = enumm[1].toUpperCase();
        return CardService[cat][type];
    }
    footer(widget1, widget2){

      const footer = CardService.newFixedFooter()
      if(widget1)
        footer.setPrimaryButton( widget1);
      
      if(widget2)
        footer.setPrimaryButton( widget1);
      this.builder_.setFixedFooter(footer);
    }
    notify(text) {
        return CardService.newActionResponseBuilder()
          .setNotification(CardService.newNotification().setText(text))
          .build()
      }
    static addParams(params, e){
        e.commonEventObject.parameters = ({ ...e.commonEventObject.parameters, ...params });
    }
    static update(card){
      return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().updateCard(card.response_)).build()
    }
}


