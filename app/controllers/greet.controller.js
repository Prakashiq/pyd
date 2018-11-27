import BaseController from './base.controller';
import sndrsp from '../middleware/sndrsp';

class GreetController extends BaseController {
  greet = async (req, res, version, next) => {

    // Get today's date
    const datetimeNow = new Date(new Date().getTime() - 300*60*1000);
    const hourNow = datetimeNow.getHours();
    // const minuteNow = datetimeNow.getMinutes();

    // console.log(hourNow +":" + minuteNow);

    let greet = 'Good Night ';

    // Compare today with October 3rd
    if (hourNow >= 5 && hourNow <= 11 ) {
      greet = 'Good Morning ';
    } else if (hourNow >= 12 && hourNow < 18 ){
      greet = 'Good Afernoon ';
    }  else if (hourNow >= 18 && hourNow < 24 ){
      greet = 'Good Night ';
    }
    

    let responseJson = {
      speech: 'Hi ' + greet + 
              'I am your pickup assistant. Please tell your userid?',
      outputContexts: [{ 'name': '', 'lifespan': 1, 'parameters': {} }],
      session: req.body.session
    };

    return res.json(sndrsp.sendResponse(responseJson, version));
  }
}

export default new GreetController();
