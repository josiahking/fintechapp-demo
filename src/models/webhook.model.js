const knex = require('../../knex');

class WebhookEvent {
  /**
   * Logs a webhook event into the `webhook_events` table.
   * @param {Object} payload - The entire webhook payload from Raven or another provider.
   * @param {string} [payload.type] - Type of webhook event (e.g., 'transfer', 'collection').
   * @param {string} [payload.status] - Status of the event (e.g., 'success', 'failed').
   * @returns {Promise<number[]>} - Insert result containing an array of inserted row IDs.
   */
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
