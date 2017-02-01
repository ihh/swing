import _ from 'lodash';
import Sister from 'sister';
import rebound from 'rebound';
import Card from './Card';

/**
 * @param {Object} config Stack configuration.
 * @returns {Object} An instance of Stack object.
 */
const Stack = function (config) {
  var eventEmitter;
  var index;
  var springSystem;
  var stack;

  const construct = function () {
    stack = {};
    springSystem = new rebound.SpringSystem();
    eventEmitter = Sister();
    index = [];
  };

  construct();

  /**
   * Get the configuration object.
   *
   * @returns {Object}
   */
  stack.getConfig = function () {
    return config;
  };

  /**
   * Get a singleton instance of the SpringSystem physics engine.
   *
   * @returns {Sister}
   */
  stack.getSpringSystem = function () {
    return springSystem;
  };

  /**
   * Proxy to the instance of the event emitter.
   *
   * @param {string} eventName
   * @param {string} listener
   * @returns {undefined}
   */
  stack.on = function (eventName, listener) {
    eventEmitter.on(eventName, listener);
  };

  /**
   * Creates an instance of Card and associates it with an element.
   *
   * @param {HTMLElement} element
   * @returns {Card}
   */
  stack.createCard = function (element) {
    const card = Card(stack, element);
    const events = [
      'throwout',
      'throwoutend',
      'throwoutleft',
      'throwoutright',
      'throwoutup',
      'throwoutdown',
      'throwin',
      'throwinend',
      'dragstart',
      'dragmove',
      'dragend'
    ];

    // Proxy Card events to the Stack.
    events.forEach(function (eventName) {
      card.on(eventName, function (data) {
        eventEmitter.trigger(eventName, data);
      });
    });

    index.push({
      card: card,
      element: element
    });

    return card;
  };

  /**
   * Returns an instance of Card associated with an element.
   *
   * @param {HTMLElement} element
   * @returns {Card|null}
   */
  stack.getCard = function (element) {
    const group = _.find(index, {
      element: element
    });

    if (group) {
      return group.card;
    }

    return null;
  };

  /**
   * Remove an instance of Card from the stack index.
   *
   * @param {Card} card
   * @returns {null}
   */
  stack.destroyCard = function (card) {
    return _.remove(index, {
      card: card
    });
  };

  return stack;
};

export default Stack;
