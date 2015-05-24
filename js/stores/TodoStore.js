/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');
var Immutable = require('immutable')

var CHANGE_EVENT = 'change';

var _todos = Immutable.Map();

function create(text) {
    // 36進数（0-9a-z)の36文字でID生成
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _todos = _todos.set(id, {
        id: id,
        complete: false,
        text: text
    });
}

function update(id, data) {
    _todos = _todos.update(id, function(todo) {
        return assign({}, todo, data);
    });
}

// Update all of the TODO items with the same object.
function updateAll(data) {
    _todos.forEach(function(todo, id, todos) {
        update(id, data);
    });
}

function destroy(id) {
    _todos = _todos.delete(id)
}

// Delete all the completed TODO items.
function destroyCompleted() {
    _todos = _todos.filter(function(todo, id, todos) {
        if(todo.complete == false) return todo;
    });
}

// EventEmitterの拡張
var TodoStore = assign({}, EventEmitter.prototype, {

    // all the remaining TODO items are marked as completed.
    areAllComplete: function() {
        var uncomplete = _todos.filter(function(todo, id, todos) {
            if(todo.complete === false) return todo;
        });
        return (uncomplete.size > 0)? false : true;
    },

    getAll: function() {
        return _todos.toObject();
    },

    // リスナー登録
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    // 指定されたイベントに対するリスナーを追加
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    // リスナーを削除
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// callback登録
AppDispatcher.register(function(action) {
    var text;

    switch(action.actionType) {
        case TodoConstants.TODO_CREATE:
            text = action.text.trim();
            if (text !== '') {
                create(text);
                TodoStore.emitChange();
            };
            break;

        case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
            if (TodoStore.areAllComplete()) {
                updateAll({complete: false});
            }
            else {
                updateAll({complete: true});
            }
            TodoStore.emitChange();
            break;

        case TodoConstants.TODO_COMPLETE:
            update(action.id, {complete: true});
            TodoStore.emitChange();
            break;

        case TodoConstants.TODO_UNDO_COMPLETE:
            update(action.id, {complete: false});
            TodoStore.emitChange();
            break;

        case TodoConstants.TODO_UPDATE_TEXT:
            text = action.text.trim();
            if (text !== '') {
                update(action.id, {text: text});
                TodoStore.emitChange();
            }
            break;

        case TodoConstants.TODO_DESTROY:
            destroy(action.id);
            TodoStore.emitChange();
            break;

        case TodoConstants.TODO_DESTROY_COMPLETED:
            destroyCompleted();
            TodoStore.emitChange();
            break;

        default:
            return;
    };
});

module.exports = TodoStore;
