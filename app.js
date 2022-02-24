// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000; 
const { body, validationResult } = require('express-validator');
const server = http.createServer(app);

const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['pt'], forceNER: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// SAUDCÃO
manager.addDocument('pt', 'Boa tarde', 'saudacao');
manager.addDocument('pt', 'cardápio', 'saudacao');
manager.addDocument('pt', 'Boa noite', 'saudacao');
manager.addDocument('pt', 'Pedido', 'saudacao');
manager.addDocument('pt', 'Olá', 'saudacao');
manager.addDocument('pt', 'Oi', 'saudacao');
manager.addDocument('pt', 'Ola Boa tarde', 'saudacao');


// ENDEREÇOS E HORARIOS
manager.addDocument('pt', 'Boa tarde Endereço', 'localizacao');
manager.addDocument('pt', 'Boa noite Endereço', 'localizacao');
manager.addDocument('pt', 'Boa noite Horário', 'localizacao');
manager.addDocument('pt', 'Boa tarde Horário', 'localizacao');
manager.addDocument('pt', 'localizado', 'localizacao');




// ETIQUETAS
manager.addDocument('pt', 'Ok', 'etiqueta');
manager.addDocument('pt', 'Blz', 'etiqueta');
manager.addDocument('pt', 'Ta bom', 'etiqueta');
manager.addDocument('pt', 'Beleza', 'etiqueta');
manager.addDocument('pt', 'obg', 'etiqueta');


// RECLAMAÇÃO
manager.addDocument('pt', 'Pedido errado', 'Reclamacao');


manager.addDocument('pt', 'Reclamação', 'Reclamacao');
manager.addDocument('pt', 'Reclamações', 'Reclamacao');






// RESPOSTA DE SAUDAÇÃO
manager.addAnswer('pt', 'saudacao', 'Bem-vindo ao Doce Amor. Este é o nosso autoatendimento!🤖\nPara fazer um pedido clique no link a baixo:\nhttps://pizzariavenezamorrodoce.bubbleapps.io/version-test/delivery');
manager.addAnswer('pt', 'saudacao', 'Olá quer fazer um pedido mais rápido? \nclique no link a baixo:\nhttps://pizzariavenezamorrodoce.bubbleapps.io/version-test/delivery');




// RESPOSTA DE LOCALIZÇÃO
manager.addAnswer('pt', 'localizacao', '*Nossos horários de atendemento:*\nDe Segunda - Domingo \ndas 17:30 às 23:50 \n*Endereço:*\nRua Virgínia Castiglioni, 387 - Parque Anhangüera, São Paulo - SP, 05271-080, Brasil\n\n*Como chegar:*\n https://goo.gl/maps/VKrMHMyswGU3bu5v7');


// RESPOSTA DE ETIQUETAS
manager.addAnswer('pt', 'etiqueta', '😉');


//RESPOSTA RECLAMAÇÃO
manager.addAnswer('pt', 'Reclamacao', 'Oi nos desculpe pelo transtorno!😐\nNossa equipe irá atende-lo.');





// Train and save the model.
(async() => {
    await manager.train();
    manager.save();
    venom
    .create({
      session: 'session-name', //name of session
      multidevice: true // for version not multidevice use false.(default: true)
    })
    .then((client) =>{
  
  client.onMessage(async(message) =>{
      if (message.isGroupMsg == false){
        const response = await manager.process('pt', message.body.toLowerCase());
       
       
        client.sendText(message.from, response.answer);
       

        console.log(response.intent);
        console.log(response.score);
        
         
      }
  })
  
  
  
  
  
      app.post('/send-message', [
          body('number').notEmpty(),
          body('message').notEmpty(),
        ], async (req, res) => {
          const errors = validationResult(req).formatWith(({
            msg
          }) => {
            return msg;
          });
        
          if (!errors.isEmpty()) {
            return res.status(422).json({
              status: false,
              message: errors.mapped()
            });
          }
        
          const number = req.body.number;
          const message = req.body.message;
      
          client.sendText(number, message).then(response => {
              res.status(200).json({
                  status: true,
                  message: 'mesagem enviada',
                  response: response
              });
          }).catch(err => {
              res.status(500).json({
                  status: false,
                  message: 'Mesagem não enviada',
                  response: err.text
              });
             });
             
          })
  
          server.listen(port, function() {
              console.log('App running on *: ' + port);
            });
  
    })//acaba aqui
      
    .catch((erro) => {
      console.log(erro);
    });

    
})();







  



