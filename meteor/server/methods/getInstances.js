
Meteor.methods({
    /**
      * Meteor method to execute the current model and get model instances.
      * This will call the Alloy API (webService). If the model contains
      * secrets and the previous didn't (if any), will become a new derivation
      * root (although it still registers the derivation).
      *
      * @param {String} code the Alloy model to execute
      * @param {Number} commandIndex the index of the command to execute
      * @param {String} currentModelId the id of the current model (from which
      *     the new will derive)
      *
      * @returns the instance data and the id of the new saved model
      */
    async getInstances(code, commandIndex, fromPrivate, currentModelId) {
        try {
            const sessionId = Date.now().toString()

            const response = await fetch(`${Meteor.settings.env.API_URL}/getInstances`, {
                method: "POST",
                body: JSON.stringify({
                    model: code,
                    numberOfInstances: Meteor.settings.env.MAX_INSTANCES,
                    commandIndex: commandIndex,
                    sessionId: sessionId,
                    parentId: currentModelId || ''
                })
            });

            const content = await response.json();

            return {
                instances: content,
                newModelId: sessionId
            }
        } catch (error) {
            throw new Meteor.Error("get-instances-failed", error.message || "Error getting instances")
        }
    }
})
