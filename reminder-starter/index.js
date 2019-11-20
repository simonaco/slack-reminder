const df = require('durable-functions');
const axios = require('axios');
var qs = require('querystring');

module.exports = async function(context, req) {
    req.body = qs.parse(req.body);


  const client = df.getClient(context);
  const accessToken = process.env['SLACK_ACCESS_TOKEN'];
  const userResponse = await axios.get(
    `https://slack.com/api/users.info?token=${accessToken}&user=${req.body.user_id}`
  );
  const userTimeZone = userResponse.data.user.tz;


  context.log('timezone>>>>>>>', userTimeZone);

  const instanceId = await client.startNew(
    req.params.functionName,
    undefined,
    Object.assign(req.body, { timeZone: userTimeZone }))
  context.log(`Started orchestration with ID = '${instanceId}'.`);

  const timerStatus = client.createCheckStatusResponse(
    context.bindingData.req,
    instanceId
  );

  context.log(timerStatus);

  return {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 200,
    body: {
      response_type: 'in_channel',
      text: `*${req.body.text}* has been scheduled`
    }
  };
};