import { Router } from 'express';

import MetaController from './controllers/meta.controller';
import SOSController from './controllers/sos.controller';
import GreetController from './controllers/greet.controller';
import DoorStatusController from './controllers/door.controller';
import Constants from './config/constants';

// import accessControl from './middleware/access-control';
import errorHandler from './middleware/error-handler';
import sndrsp from './middleware/sndrsp';
import { LocaleService } from './middleware/localeService.js';

import i18n from './middleware/i18n.config.js';
import SmsService from './middleware/sms-service';

const routes = new Router();
const localeService = new LocaleService(i18n);

routes.get('/', MetaController.index);

routes.post('/', function(req, res) {

  let action, version,lang ;

  if (req.body.id !== undefined && req.body.responseId === undefined) {
    version = 'V1';
  } 
  else if (req.body.id === undefined && req.body.responseId !== undefined) {
    version = 'V2';
  }
  else {
      let responseJson = {
          speech: localeService.translate('Unknown Version of Dialog Flow, please contact System Administartor'),
          outputContexts: [{ 'name': 'start_login', 'lifespan': 1, 'parameters': {} }],
          session: req.body.session
          };
        return res.json(sndrsp.sendResponse( responseJson, version));
  }

  if (version === 'V2') {
    action = (req.body.queryResult ===undefined) ? null:
    (req.body.queryResult.action === undefined)? null : req.body.queryResult.action;

    lang = (req.body.queryResult.languageCode === undefined) ? "en" : req.body.queryResult.languageCode;
    localeService.setLocale(lang);
  }
  else{ // DEFAULT TO V1
    action = (req.body.result ===undefined) ? null:
    (req.body.result.action === undefined)? null : req.body.result.action;

    lang = (req.body.lang === undefined) ? "en" : req.body.lang;
    localeService.setLocale(lang);
  }
  console.log('DialogFlow Version: ', version);
  console.log('DialogFlow Intent:', action);
  console.log('DialogFlow Language:', localeService.getCurrentLocale());
  // console.log('DialogFlow Body:', JSON.stringify(req.body,undefined,2));

    //INTENT_IN : GREET 
    //PARAMETER_IN:  
    
	  if ( action != null && action == 'greet') {
      return GreetController.greet(req, res,version);
    }
    else if ( action != null && action == 'doorstatus') {
      return DoorStatusController.status(req, res,version);
    } 
    else if ( action != null && action == 'sendSMS'){
      return SmsService.sendSMS(req, res, version);
    }
    else if ( action != null && action == 'callMgr'){
      return SmsService.callMgr(req, res, version);
    }
    else if( action != null && action == 'incomingSMS') {
    // console.log(JSON.stringify(req.body,undefined,2));
    let responseJson = {
      speech: localeService.translate('you have a text'),
      outputContexts: [{ 'name': 'exitcontext', 'lifespan': 1, 'parameters': {} }],
      session: req.body.session
      };
    return res.json(sndrsp.sendResponse( responseJson, version));
  }
    else {
      let responseJson = {
          speech: localeService.translate('I didn\'t get that. Can you say it again?'),
          outputContexts: [{ 'name': 'start_login', 'lifespan': 1, 'parameters': {} }],
          session: req.body.session
          };
        return res.json(sndrsp.sendResponse( responseJson, version));
      }
});

routes.post('/call', SOSController.create);

routes.post('/smsreply', SOSController.recvSMS);
// routes.post('/checkDigit', TripController.checkDigityValidation);

// Admin
// routes.get('/admin', accessControl('admin'), MetaController.index);

routes.use(errorHandler);

export default routes;
