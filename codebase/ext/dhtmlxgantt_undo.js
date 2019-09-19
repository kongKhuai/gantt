/*
@license

dhtmlxGantt v.6.2.6 Standard

This version of dhtmlxGantt is distributed under GPL 2.0 license and can be legally used in GPL projects.

To use dhtmlxGantt in non-GPL projects (and get Pro version of the product), please obtain Commercial/Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxGantt/#licensing or contact us at sales@dhtmlx.com

(c) XB Software Ltd.

*/
!function(t,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var e=n();for(var o in e)("object"==typeof exports?exports:t)[o]=e[o]}}(window,function(){return function(t){var n={};function e(o){if(n[o])return n[o].exports;var a=n[o]={i:o,l:!1,exports:{}};return t[o].call(a.exports,a,a.exports,e),a.l=!0,a.exports}return e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:o})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(e.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var a in t)e.d(o,a,function(n){return t[n]}.bind(null,a));return o},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="/codebase/",e(e.s=211)}({211:function(t,n){gantt.config.undo_steps=10,gantt.config.undo=!0,gantt.config.redo=!0,gantt.undo=function(){this._undo.undo()},gantt.getUndoStack=function(){return this._undo._undoStack},gantt.getRedoStack=function(){return this._undo._redoStack},gantt.clearUndoStack=function(){this._undo._undoStack=[]},gantt.clearRedoStack=function(){this._undo._redoStack=[]},gantt.redo=function(){this._undo.redo()},gantt.config.undo_types={link:"link",task:"task"},gantt.config.undo_actions={update:"update",remove:"remove",add:"add",move:"move"},gantt._undo={_undoStack:[],_redoStack:[],maxSteps:10,undo_enabled:!0,redo_enabled:!0,_push:function(t,n){if(n.commands.length){var e=t===this._undoStack?"onBeforeUndoStack":"onBeforeRedoStack";if(!1!==gantt.callEvent(e,[n])&&n.commands.length){for(t.push(n);t.length>this.maxSteps;)t.shift();return n}}},_pop:function(t){return t.pop()},_reorderCommands:function(t){var n={any:0,link:1,task:2},e={move:1,any:0};t.commands.sort(function(t,o){if("task"==t.entity&&"task"==o.entity)return t.type!=o.type?(e[o.type]||0)-(e[t.type]||0):"move"==t.type&&t.oldValue&&o.oldValue&&o.oldValue.parent==t.oldValue.parent?t.$index-o.$index:0;var a=n[t.entity]||n.any;return(n[o.entity]||n.any)-a})},undo:function(){if(this.updateConfigs(),this.undo_enabled){var t=this._pop(this._undoStack);if(t&&this._reorderCommands(t),!1!==gantt.callEvent("onBeforeUndo",[t])&&t)return this._applyAction(this.action.invert(t)),this._push(this._redoStack,gantt.copy(t)),void gantt.callEvent("onAfterUndo",[t]);gantt.callEvent("onAfterUndo",[null])}},redo:function(){if(this.updateConfigs(),this.redo_enabled){var t=this._pop(this._redoStack);if(t&&this._reorderCommands(t),!1!==gantt.callEvent("onBeforeRedo",[t])&&t)return this._applyAction(t),this._push(this._undoStack,gantt.copy(t)),void gantt.callEvent("onAfterRedo",[t]);gantt.callEvent("onAfterRedo",[null])}},_applyAction:function(t){var n=null,e=this.command.entity,o=this.command.type,a={};a[e.task]={add:"addTask",update:"updateTask",remove:"deleteTask",move:"moveTask",isExists:"isTaskExists"},a[e.link]={add:"addLink",update:"updateLink",remove:"deleteLink",isExists:"isLinkExists"},gantt.batchUpdate(function(){for(var e=0;e<t.commands.length;e++){n=t.commands[e];var i=a[n.entity][n.type],s=a[n.entity].isExists;n.type==o.add?gantt[i](n.oldValue,n.oldValue.parent,n.oldValue.$index):n.type==o.remove?gantt[s](n.value.id)&&gantt[i](n.value.id):n.type==o.update?gantt[i](n.value.id,n.value):n.type==o.move&&gantt[i](n.value.id,n.value.$index,n.value.parent)}})},logAction:function(t){this._push(this._undoStack,t),this._redoStack=[]},action:{create:function(t){return{commands:t?t.slice():[]}},invert:function(t){for(var n=gantt.copy(t),e=gantt._undo.command,o=0;o<t.commands.length;o++){var a=n.commands[o]=e.invert(n.commands[o]);if(a.type==e.type.update||a.type==e.type.move){var i=a.value;a.value=a.oldValue,a.oldValue=i}}return n}},command:{create:function(t,n,e,o){return{entity:o,type:e,value:gantt.copy(t),oldValue:gantt.copy(n||t)}},invert:function(t){var n=gantt.copy(t);return n.type=this.inverseCommands(t.type),n},entity:null,type:null,inverseCommands:function(t){switch(t){case this.type.update:return this.type.update;case this.type.remove:return this.type.add;case this.type.add:return this.type.remove;case this.type.load:return this.type.clear;case this.type.clear:return this.type.load;case this.type.move:return this.type.move;default:return gantt.assert(!1,"Invalid command "+t),null}}},monitor:{_batchAction:null,_batchMode:!1,_ignore:!1,_ignoreMoveEvents:!1,isMoveEventsIgnored:function(){return this._ignoreMoveEvents},toggleIgnoreMoveEvents:function(t){this._ignoreMoveEvents=t||!1},startIgnore:function(){this._ignore=!0},stopIgnore:function(){this._ignore=!1},startBatchAction:function(){this.timeout&&clearTimeout(this.timeout),this.timeout=setTimeout(function(){gantt._undo.monitor.stopBatchAction()},10),this._ignore||this._batchMode||(this._batchMode=!0,this._batchAction=gantt._undo.action.create())},stopBatchAction:function(){if(!this._ignore){var t=gantt._undo;this._batchAction&&t.logAction(this._batchAction),this._batchMode=!1,this._batchAction=null}},_storeCommand:function(t){var n=gantt._undo;if(n.updateConfigs(),n.undo_enabled)if(this._batchMode)this._batchAction.commands.push(t);else{var e=n.action.create([t]);n.logAction(e)}},_storeEntityCommand:function(t,n,e,o){var a=gantt._undo.command.create(t,n,e,o);this._storeCommand(a)},_storeTaskCommand:function(t,n){this._storeEntityCommand(t,this.getInitialTask(t.id),n,gantt._undo.command.entity.task)},_storeLinkCommand:function(t,n){this._storeEntityCommand(t,this.getInitialLink(t.id),n,gantt._undo.command.entity.link)},onTaskAdded:function(t){this._ignore||this._storeTaskCommand(t,gantt._undo.command.type.add)},onTaskUpdated:function(t){this._ignore||this._storeTaskCommand(t,gantt._undo.command.type.update)},onTaskMoved:function(t){this._ignore||this._storeEntityCommand(t,this.getInitialTask(t.id),gantt._undo.command.type.move,gantt._undo.command.entity.task)},onTaskDeleted:function(t){if(!this._ignore){if(this._storeTaskCommand(t,gantt._undo.command.type.remove),this._nestedTasks[t.id])for(var n=this._nestedTasks[t.id],e=0;e<n.length;e++)this._storeTaskCommand(n[e],gantt._undo.command.type.remove);if(this._nestedLinks[t.id]){var o=this._nestedLinks[t.id];for(e=0;e<o.length;e++)this._storeLinkCommand(o[e],gantt._undo.command.type.remove)}}},onLinkAdded:function(t){this._ignore||this._storeLinkCommand(t,gantt._undo.command.type.add)},onLinkUpdated:function(t){this._ignore||this._storeLinkCommand(t,gantt._undo.command.type.update)},onLinkDeleted:function(t){this._ignore||this._storeLinkCommand(t,gantt._undo.command.type.remove)},_initialTasks:{},_nestedTasks:{},_nestedLinks:{},_getLinks:function(t){return t.$source.concat(t.$target)},setNestedTasks:function(t,n){for(var e=null,o=[],a=this._getLinks(gantt.getTask(t)),i=0;i<n.length;i++)e=this.setInitialTask(n[i]),a=a.concat(this._getLinks(e)),o.push(e);var s={};for(i=0;i<a.length;i++)s[a[i]]=!0;var d=[];for(var i in s)d.push(this.setInitialLink(i));this._nestedTasks[t]=o,this._nestedLinks[t]=d},setInitialTask:function(t,n){if(n||!this._initialTasks[t]||!this._batchMode){var e=gantt.copy(gantt.getTask(t));e.$index=gantt.getTaskIndex(t),this.setInitialTaskObject(t,e)}return this._initialTasks[t]},getInitialTask:function(t){return this._initialTasks[t]},clearInitialTasks:function(){this._initialTasks={}},setInitialTaskObject:function(t,n){this._initialTasks[t]=n},_initialLinks:{},setInitialLink:function(t){return this._initialLinks[t]&&this._batchMode||(this._initialLinks[t]=gantt.copy(gantt.getLink(t))),this._initialLinks[t]},getInitialLink:function(t){return this._initialLinks[t]}}},gantt._undo.updateConfigs=function(){gantt._undo.maxSteps=gantt.config.undo_steps,gantt._undo.command.entity=gantt.config.undo_types,gantt._undo.command.type=gantt.config.undo_actions,gantt._undo.undo_enabled=!!gantt.config.undo,gantt._undo.redo_enabled=!!gantt.config.undo&&!!gantt.config.redo},function(){var t=gantt._undo.monitor,n={onBeforeUndo:"onAfterUndo",onBeforeRedo:"onAfterRedo"};for(var e in n)gantt.attachEvent(e,function(){return t.startIgnore(),!0}),gantt.attachEvent(n[e],function(){return t.stopIgnore(),!0});var o=["onTaskDragStart","onAfterTaskUpdate","onAfterTaskDelete","onBeforeBatchUpdate"];for(e=0;e<o.length;e++)gantt.attachEvent(o[e],function(){return t.startBatchAction(),!0});function a(n){return t.setInitialTask(n),gantt.eachTask(function(n){t.setInitialTask(n.id)},n),!0}gantt.attachEvent("onBeforeTaskDrag",a),gantt.attachEvent("onLightbox",a),gantt.attachEvent("onBeforeTaskAutoSchedule",function(t){return a(t.id),!0});var i=null;function s(){i||(i=setTimeout(function(){i=null}),t.clearInitialTasks(),gantt.eachTask(function(n){t.setInitialTask(n.id)}))}gantt.attachEvent("onBeforeTaskDelete",function(n){a(n);var e=[];return s(),gantt.eachTask(function(t){e.push(t.id)},n),t.setNestedTasks(n,e),!0}),gantt.ext.inlineEditors&&gantt.ext.inlineEditors.attachEvent("onEditStart",function(t){a(t.id)}),gantt.attachEvent("onAfterTaskAdd",function(n,e){t.setInitialTask(n,!0),t.onTaskAdded(e)}),gantt.attachEvent("onAfterTaskUpdate",function(n,e){t.onTaskUpdated(e)}),gantt.attachEvent("onAfterTaskDelete",function(n,e){t.onTaskDeleted(e)}),gantt.attachEvent("onAfterLinkAdd",function(n,e){t.onLinkAdded(e)}),gantt.attachEvent("onAfterLinkUpdate",function(n,e){t.onLinkUpdated(e)}),gantt.attachEvent("onAfterLinkDelete",function(n,e){t.onLinkDeleted(e)});var d=gantt.getDatastore("task");function r(t){return gantt.copy(gantt.getTask(t))}function u(t,n,e){t&&(t.id==n&&(t.id=e),t.parent==n&&(t.parent=e))}function c(t,n,e){u(t.value,n,e),u(t.oldValue,n,e)}function l(t,n,e){t&&(t.source==n&&(t.source=e),t.target==n&&(t.target=e))}function g(t,n,e){l(t.value,n,e),l(t.oldValue,n,e)}function f(t,n,e){for(var o=gantt._undo,a=0;a<t.length;a++)for(var i=t[a],s=0;s<i.commands.length;s++)i.commands[s].entity==o.command.entity.task?c(i.commands[s],n,e):i.commands[s].entity==o.command.entity.link&&g(i.commands[s],n,e)}function h(t,n,e){for(var o=gantt._undo,a=0;a<t.length;a++)for(var i=t[a],s=0;s<i.commands.length;s++){var d=i.commands[s];d.entity==o.command.entity.link&&(d.value&&d.value.id==n&&(d.value.id=e),d.oldValue&&d.oldValue.id==n&&(d.oldValue.id=e))}}d.attachEvent("onBeforeItemMove",function(n,e,o){return t.isMoveEventsIgnored()||s(),!0}),d.attachEvent("onAfterItemMove",function(n,e,o){return t.isMoveEventsIgnored()||t.onTaskMoved(r(n)),!0}),gantt.attachEvent("onRowDragStart",function(n,e,o){return t.toggleIgnoreMoveEvents(!0),s(),!0}),gantt.attachEvent("onRowDragEnd",function(n,e){return t.onTaskMoved(r(n)),t.toggleIgnoreMoveEvents(),!0}),gantt.attachEvent("onTaskIdChange",function(t,n){var e=gantt._undo;f(e._undoStack,t,n),f(e._redoStack,t,n)}),gantt.attachEvent("onLinkIdChange",function(t,n){var e=gantt._undo;h(e._undoStack,t,n),h(e._redoStack,t,n)}),gantt.attachEvent("onGanttReady",function(){gantt._undo.updateConfigs()})}()}})});
//# sourceMappingURL=dhtmlxgantt_undo.js.map