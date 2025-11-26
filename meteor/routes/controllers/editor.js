
/**
 * This is used to retrieve data when the Route contains a link /:_id
 */
editor = RouteController.extend({
    template: 'alloyEditor',

    // see http://iron-meteor.github.io/iron-router/#subscriptions
    subscriptions() {
    },

    // see http://iron-meteor.github.io/iron-router/#the-waiton-option
    waitOn() {},

    data() {},

    onRun() {
        this.next()
    },
    onRerun() {
        this.next()
    },
    onBeforeAction() {
        this.next()
    },
    action() {
        this.render()
    },
    onAfterAction() {},
    onStop() {}
})
