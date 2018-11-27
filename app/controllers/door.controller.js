import BaseController from './base.controller';
import sndrsp from '../middleware/sndrsp';

class DoorController extends BaseController {
  status = async (req, res, version, next) => {
    let {doorNumber}  = (version === 'V2') ? req.body.queryResult.parameters :  req.body.result.parameters;
  
    let responseJson = {
      speech: 'Currently the Door '+ doorNumber +' is in Open Status',
      outputContexts: [{ 'name': '', 'lifespan': 1, 'parameters': {} }],
      session: req.body.session
    };

    return res.json(sndrsp.sendResponse(responseJson, version));
  }
}

export default new DoorController();
