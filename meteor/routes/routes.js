/**
 * Defines the routes for the application
 */
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import '../imports/ui/layouts/mainLayout.html';

FlowRouter.route('/', {
  name: 'alloyEditor',
  action() {
    BlazeLayout.render('mainLayout', { content: 'alloyEditor' });
  }
});

FlowRouter.route('*', {
  action() {
    BlazeLayout.render('mainLayout', { content: 'notFound' });
  }
});
