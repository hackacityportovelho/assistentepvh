'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Suggestions, LinkOutSuggestion} = require('dialogflow-fulfillment');
const { Carousel, BrowseCarousel, BrowseCarouselItem, Image } = require('actions-on-google');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const db = [
    {
      "nome": "Centro de Saúde Agenor de Carvalho",
      "horarioAtendimento":"Segunda a Sexta das 6h as 14h",
      "logradouro" : "Rua Victor Ferreira manahiba, 1209, Agenor M de Carvalho",
      "telefone":"(69)3222-0006",
      "imagem":"https://www.sncm.com.br/wp-content/uploads/2017/06/unidade-basica-saude-1.jpg",
      "especialidades": ["cardiologista", "pediatra", "otorrinolaringologista"]
    },
    {
      "nome": "Centro de Saúde Maurício Bustani",
      "horarioAtendimento":"Segunda a Sexta das 8h as 12h, das 14h as 18h e das 19h as 21:30h",
      "logradouro" : "Avenida Jorge Teixeira, s/n, Setor Industrial",
      "telefone":"(69)2182-3434",
      "imagem":"http://www.diariodaamazonia.com.br/gerenciador/data/uploads/2017/07/C1-Centro-de-Sa%C3%BAde-Maur%C3%ADcio-Bustani-cr%C3%A9dito-Condecom-copy.jpg",
      "especialidades": ["cardiologista", "pediatra", "oncologista"]
    },
    {
      "nome": "Centro de Saude Pedacinho de Chão",
      "horarioAtendimento":"Segunda a Sexta das 6h as 14h",
      "logradouro" : "Avenida Tiradentes, 3420, Embratel",
      "telefone":"(69)3225-9976",
      "imagem":"http://portal.colombo.pr.gov.br/wp-content/uploads/2015/10/foto-1.jpg",
      "especialidades": ["cardiologista", "ginecologista","proctologista"]
    },
    {
      "nome": "Centro de Saude Caladinho",
      "horarioAtendimento":"Segunda a Sexta das 6h as 14h",
      "logradouro" : "Rua Tancredo Neves, 600, Caladinho",
      "telefone":"(69)3225-9976",
      "imagem":"https://www.98fmcuritiba.com.br/wp-content/uploads/2017/12/21095806/unidade-basica-parolin.jpg",
      "especialidades": ["cardiologista", "pediatra", "dermatologista"]
    },
    {
      "nome": "Unidade de Saude da Família Hamilton Raulino Gondin",
      "horarioAtendimento":"Segunda a Sexta das 6h as 14h",
      "logradouro" : "Rua José Amador dos Reis, 3514, Tancredo Neves",
      "telefone":"(69)3225-9976",
      "imagem":"https://correiodecarajas.com.br/wp-content/uploads/2018/05/parauapebas-unidade-de-saude-e-inaugurada-no-bairro-cidade-nova.jpg",
      "especialidades": ["cardiologista", "pediatra", "proctologista"]
    },
    {
      "nome": "Policlinica Ana Adelaide",
      "horarioAtendimento":"Domingo a domingo 24h",
      "logradouro" : "Rua Padre Chiquinho, 1060, Pedrinhas",
      "telefone":"(69)3224-2834",
      "imagem":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqZ45Pw1jmBnCZwsCF75R6qDKC_MP_vErv6Jk_uD3E7h0EymxS5A",
      "especialidades": ["neurologista", "clinico geral"]
    },
    {
      "nome": "Unidade de Saude Nova Floresta",
      "horarioAtendimento":"Segunda a sexta 8h as 15h",
      "logradouro" : "Av. Jatuarana, 3510, Conceicao",
      "telefone":"(69)3227-7288",
      "imagem":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2z1Pa3jfAJ973ECE8hr7VwKX0iP2hH0kLWUqTLQBN-1-41kjaew",
      "especialidades": ["dentista", "fisioterapia","ortopedia"]
    }
  ];

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  //console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  let intentMap = new Map();


  //Buscar Especialidades intencao
  intentMap.set('busca_especialidade_servico', (agent) =>  {
  	let conv = agent.conv();
  	let profissional = agent.parameters.profissional;
    console.log('Profissional:' +  agent.parameters);

    let items = db.filter(i => i.especialidades.includes(profissional));
    console.log(items);

  /*  agent.add(`Temos disponivel ${profissional} nas seguintes unidades de saude`);
    agent.add(new Card(
      {
        title: `Policlinica Oswaldo Cruz`,
        imageUrl: 'http://data.portal.sistemas.ro.gov.br/2016/11/dia-mundial-diabetes-02-570x379.jpg',
        text: `Aberto das 8:00 as 21:00`

      }
    )); */

    if (items.length === 0) {
      agent.add(`verifiquei aqui, mas não encontrei nenhum ${profissional} neste momento`);

    }


    if (items.length === 1) {
      agent.add(`Temos disponivel ${profissional} na seguinte unidade de saúde`);
      agent.add(new Card(
        {
          title: items[0].nome,
          subtitle: items[0].logradouro,
          imageUrl: items[0].imagem,
          text: items[0].horarioAtendimento,
          buttonText: 'Ligar',
          buttonUrl: `http://bit.ly/Oao79812h`
        }
      ));

    }

    if (items.length > 1) {

      conv.ask(`Temos disponivel ${profissional}s nas seguintes unidades de saúde:`);
      let c_items = [];

      items.forEach((item) => {
          let _bci = new BrowseCarouselItem({
            title: item.nome,
            url: `http://bit.ly/Lassfiu89`,
            description: item.horarioAtendimento,
            image: new Image({
              url: item.imagem,
              alt: 'Foto unidade'
            }),
            footer: item.logradouro,
          });
          c_items.push(_bci);
      });

      // Create a browse carousel
      conv.ask(new BrowseCarousel({
        items: c_items,
      }));

      agent.add(conv);
    }


  });

  intentMap.set('como_funciona', (agent) =>  {
  	let conv = agent.conv();
    agent.add('Certo, aqui estão algumas sugestões');
    agent.add(new Suggestion('encotrar um pediatra'));
  });

  agent.handleRequest(intentMap);
});
