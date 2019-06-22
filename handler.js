'use strict';

const SLACK_URL = process.env.SLACK_URL;
const request = require('request-promise');

module.exports.app = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello!))',
      input: {
        event,
        context
      }
    })
  }
}

module.exports.githubpushnotification = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const { action, repository, sender } = body;

  try {
    postToSlack(SLACK_URL, `The repository ${repository.name} was updated by ${sender.login}.${action ? '\nAction: ' + action : ''}`)
  } catch (err) {
    console.log('Error when posting to Slack', err);
    callback(err);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "processed"
    }),
  };
  callback(null, response);
}

const postToSlack = async (uri, text) => {
    const response = await request.post({
      method: 'POST',
      uri,
      body: {
        text
      },
      json: true
    })
    return response;
} 

