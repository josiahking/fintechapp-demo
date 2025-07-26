const knex = require('../../knex');

class WebhookEvent {
  static async log(payload) {
    const event_type = payload?.type || 'unknown';
    const status = payload?.status || 'unknown';

    return knex('webhook_events').insert({
      event_type,
      status,
      payload,
      received_at: new Date()
    });
  }
}

module.exports = WebhookEvent;
