/**
 * Defines the routes for the application
 */

// global route settings
Router.configure({
    // Template displayed while loading data.
    loadingTemplate: 'loading',
    // Template displayed when there"s no route for the sub domain.
    notFoundTemplate: 'notFound'
})

// route settings for default endpoint "/"
Router.route('/', {
    name: 'editor',
    controller: 'editor',
    where: 'client'
})
