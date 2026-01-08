import { Meteor } from 'meteor/meteor'
import jquery from "jquery";

import './templates/alloyEditor/alloyEditor.html';
import './templates/alloyEditor/alloyEditor';
import './templates/loading/loading.html';
import './templates/notFound/notFound.html';
import './templates/textEditor/textEditor.html';
import './templates/textEditor/textEditor';
import './templates/visSettings/frameNavigation/frameNavigation.html';
import './templates/visSettings/frameNavigation/frameNavigation';
import './templates/visSettings/rightClickMenu.html';
import './templates/visSettings/rightClickMenu';

window.$ = jquery;
window.jQuery = jquery;


Meteor.startup(() => {
    // code to run on client at startup

})
