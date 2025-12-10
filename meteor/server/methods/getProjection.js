Meteor.methods({

    /**
      * Meteor method to get the projection of an Alloy instance. This will
      * call the Alloy API (webService).
      *
      * @param uuid id of the session
      * @param frameInfo object with information about the frame
      *
      * @return JSON object with the projection
      */
    async getProjection(uuid, frameInfo, idx) {
        const type = []
        for (const key in frameInfo) {
            type.push(key + frameInfo[key])
        }

        try {
            const response = await fetch(`${Meteor.settings.env.API_URL}/getProjection`, {
                method: 'POST',
                body: JSON.stringify({
                    sessionId: uuid,
                    type,
                    index: idx
                })
            });

            const content = await response.json();
            if (content.unsat) {
                    content.check = true
                } else {
                    Object.keys(content).forEach((k) => {
                        content[k].check = true
                    })
                }

            return content;
        } catch (error) {
         throw new Meteor.Error('api-error', error.message || 'An error occurred while fetching the projection from the API.')   
        }
    }
})
