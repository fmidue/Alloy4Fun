import { extractSecrets,
    containsValidSecret } from '../../lib/editor/text'

Meteor.methods({
    /**
      * Meteor method to get additional solutions to the current model. This
      * will call the Alloy API (webService) without creating a new model in
      * the database.
      *
      * @param {Number} commandIndex the index of the command to execute
      * @param {String} currentModelId the id of the current model (from which
      *     the new will derive)
      *
      * @returns the instance data and the id of the new saved model
      */
    async nextInstances(code, commandIndex, currentModelId) {
        console.log("Trying to load next instances for id:", currentModelId);
        try {
            const response = await fetch(`${Meteor.settings.env.API_URL}/getInstances`, {
                method: 'POST',
                body: JSON.stringify({
                    model: code,
                    numberOfInstances: Meteor.settings.env.MAX_INSTANCES,
                    commandIndex,
                    sessionId: currentModelId,
                    parentId: ''
                })
            });

            const content = await response.json();

            return {
                instances: content,
                newModelId: currentModelId
            };

        } catch (error) {
            throw new Meteor.Error("next-instances-failed", error.message || "Failed to get next instances");
        }
    }
})
