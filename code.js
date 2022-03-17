function introCard(e){
  const card = new Card(e);
  const networkCall = new SalesforceNetworkResponse(card.input, card.parsed);
  
  card.input = networkCall.data_payload;

  card.addWidget(
    'textInput', 
    { title: card.parsed ? 'Parsed' : 'Parse this', fieldName: 'input', multiline: true, value: card.input || '' }
  );
  card.footer(
    card.widget(
      'textButton', { 
        text: card.parsed ? 'Clear' : 'Parse', 
        textButtonStyle: card.enum('textButtonStyle.filled'), 
        onClickAction: card.action('introCard', { parsed: !card.parsed ? 'true' : '', fromCard: 'true'})
      }
    )
  );
  
  return card.fromCard ? Card.update(card, e) : card.response_
}



