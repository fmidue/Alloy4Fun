/**
 * Meteor method to fetch external source code from a URL and return its body.
 * Allows the client to request content that would otherwise be blocked by CORS.
 */
Meteor.methods({
    async loadExternalSrc(url) {
        return new Promise((resolve, reject) => {
            // Basic validation: only allow http(s) URLs
            if (!/^https?:\/\//i.test(url)) {
                reject(new Meteor.Error('invalid-url', 'Only http(s) URLs are allowed'));
            }

            try {
                // Use Meteor's HTTP package (synchronous on server) to fetch the URL
                const result = HTTP.get(url, {timeout: 10 * 1000})
                if (result && result.content != null) {
                    resolve(result.content);
                } else {
                    reject(new Meteor.Error('no-content', 'No content returned from URL'));
                }
            } catch (err) {
                // Normalize errors to send back to client
                reject(new Meteor.Error('fetch-failed', err.message || 'Failed to fetch URL'));
            }
        });
    }
})
