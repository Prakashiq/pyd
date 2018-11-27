import BaseController from './base.controller';
import sndrsp from '../middleware/sndrsp';
const https = require('https');


class SOSController extends BaseController {

    create = async (req, res, next) => {
        let { userid, msg } = req.query;
        
        if (userid === null || userid == undefined ) {   
            userid = 'DC User';
          }
      
        if (msg === null || msg == undefined ) {   
            msg =  ' Have something for you! Please check with him';
          }
      
        let body = 'Hi! I\'m JARVIS, you have a message from ' + userid + ".  "+ msg;
        let xmldata = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <Response><Say voice=\"man\">"+ body +"</Say></Response>";

        // console.log("CALL msg:"+ xmldata);
        
      return res.send(xmldata); 
  }

  recvSMS(req, res, localeService) {
    const msgFrom = req.body.From;
    const msgBody = req.body.Body;
    let str = '';
   
    // console.log(msgFrom +":" + msgBody);

    var options = {
        host : 'api.dialogflow.com',
        path:  '/v1/query?v=20150910&e=receiveSMS&lang=en&sessionId=8ac79695-a692-4bbe-b5b6-9591f4a3aded',
        headers: {
          'Authorization':"Bearer c72e81168f64481cba3c55e76c797ba1"
        },
    }

    var req = https.get(options, function(res){
      
      res.on('data', function (chunk) {
        str += chunk;
      });

      res.on('end', function () {
        // console.log(req.data);
        // console.log(str);
        console.log('');

      });
    });

    let replySMS = '<Response><Message>Message delivered to DC Manager</Message> </Response>';
    
    return res.send(replySMS);
  }

}

export default new SOSController();
