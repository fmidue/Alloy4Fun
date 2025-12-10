/**
 * Defines the routes for the application
 */
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Blaze } from "meteor/blaze";

FlowRouter.route('/', {
  name: 'alloyEditor',
  action() {
    Blaze.render(Template.alloyEditor, document.body);
  }
});

FlowRouter.route('*', {
  action() {
    Blaze.render(Template.notFound, document.body);
  }
});
