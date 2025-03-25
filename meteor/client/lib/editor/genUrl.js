/**
 * Module that handles model and instance sharing.
 *
 * @module client/lib/editor/genUrl
 */

import { displayError } from './feedback'
import { modelShared,
    getCommandIndex,
    instShared,
    currentState,
    getCurrentTrace } from './state'
import { savePositions } from '../visualizer/projection'


/**
 * Handles the response to the model sharing request.
 *
 * @param {Error} err the possible meteor error
 * @param {Object} result the result to the genURL meteor call
 */
function handleShareModel(err, result) {
    if (err) return displayError(err)

    Session.set('public-model-url', `${result.public}`)
    Session.set('private-model-url', `${result.private}`)

    modelShared()
}

/**
 * Handles the response to the instance sharing request.
 *
 * @param {Error} err the possible meteor error
 * @param {Object} result the result to the storeInstance meteor call
 */
function handleShareInstance(err, result) {
    if (err) return displayError(err)

    Session.set('inst-url', `${result}`)

    instShared()
}
