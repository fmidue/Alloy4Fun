/**
 * Meteor method to fetch external source code from a URL and return its body.
 * Allows the client to request content that would otherwise be blocked by CORS.
 */
Meteor.methods({
    async loadExternalSrc(url) {

        try {
            const response = await fetch(url);
            const text = await response.text();
            return text;
        } catch (error) {
            throw new Meteor.Error('fetch-failed', error.message || 'Failed to fetch URL');
        }
    }
})
