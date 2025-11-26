/**
 * Meteor method to fetch external source code from a URL and return its body.
 * Allows the client to request content that would otherwise be blocked by CORS.
 */
Meteor.methods({
    loadExternalSrc(url) {

        // Basic validation: only allow http(s) URLs
        if (!/^https?:\/\//i.test(url)) {
            throw new Meteor.Error('invalid-url', 'Only http(s) URLs are allowed')
        }

        try {
            // Use Meteor's HTTP package (synchronous on server) to fetch the URL
            const result = HTTP.get(url, {timeout: 10 * 1000})
            if (result && result.content != null) {
                return result.content;
            } else {
                throw new Meteor.Error('no-content', 'No content returned from URL')
            }
        } catch (err) {
            // Normalize errors to send back to client
            throw new Meteor.Error('fetch-failed', err.message || 'Failed to fetch URL')
        }
    }
})
