/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 * 
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */
const axios = require("axios")
module.exports = async function (context) {
    try {
        context.log(`>>>>>>>>>>>>>>>>>>>>>>>Starting webhook request with text ${context.bindings.name.text}`);
        await axios({
          method: 'post',
          url: process.env.SLACK_WEBHOOK,
          headers: {
            'Content-type': 'application/json'
          },
          data: {
            text: context.bindings.name.text
          }
        });
        context.log('>>>>>>>>>>>>>>>>>>>>>>>Finishing webhook request');
      } catch (err) {
        context.log(err);
      }
};