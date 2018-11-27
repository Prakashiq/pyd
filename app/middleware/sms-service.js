import BaseController from '../controllers/base.controller';
import Constants from '../config/constants';
import sndrsp from './sndrsp';


class SmsService  extends BaseController{
    sendSMS = async (req, res, version, localeService, next) => {
        const client = require('twilio')(Constants.smsconfig.smsAccountSid,
        Constants.smsconfig.smsAuthToken);

        const smsbody  = (version === 'V2') ? req.body.queryResult.parameters.smsbody :  req.body.result.parameters.smsbody;       
        
        try {
            client.messages
                .create({
                    body: smsbody, 
                    from: Constants.smsconfig.smsFrom, //'+16515714917',
                    to: Constants.smsconfig.smsTo //'+16124122842'
            })
            .then(message => console.log("SMS Message send to "+ Constants.smsconfig.smsTo))
            .done();
        }
        catch  (err) { 
            console.log(err);
        }

        let responseJson = {
            outputContexts: [{ 'name': '', 'lifespan': 1, 'parameters': {} }],
            session: req.body.session
            };
        
        // console.log(JSON.stringify(responseJson));
        return res.json(sndrsp.sendResponse( responseJson, version));
    }

    callMgr = async (req, res, version, localeService, next) => {
        const client = require('twilio')(Constants.smsconfig.smsAccountSid,
        Constants.smsconfig.smsAuthToken);

        let {callmsg,userid}  = (version === 'V2') ? req.body.queryResult.parameters :  req.body.result.parameters;
        
        console.log('msg='+ encodeURIComponent(callmsg) +'&userid='+ encodeURIComponent(userid));

        client.calls
            .create({
                url: 'https://conversationengine.herokuapp.com/call?msg='+ encodeURIComponent(callmsg) 
                     +'&userid='+ encodeURIComponent(userid),
                from: Constants.smsconfig.smsFrom, //'+16515714917',
                to: Constants.smsconfig.smsTo //'+16124122842'
        })
        .then(message => console.log("SMS Message send to "+ Constants.smsconfig.smsTo))
        .done();
        let responseJson = {
            outputContexts: [{ 'name': '', 'lifespan': 1, 'parameters': {} }],
            session: req.body.session
            };
        
        return res.json(sndrsp.sendResponse( responseJson, version));
    }

}

export default new SmsService();