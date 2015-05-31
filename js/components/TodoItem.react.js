/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput.react');
var cx = require('react/lib/cx');

var ReactPropTypes = React.PropTypes;
var TodoItem = React.createClass({
    propTypes: {
        todo: ReactPropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            isEditing: false
        };
    },

    shouldComponentUpdate: function(nextProp, nextState) {
        if(nextState.isEditing) {
            return true;
        } else {
            var prevProp = this.props;
            return prevProp !== nextProp;
        }
    },

    render: function() {
        var todo = this.props.todo.toJS();
        var id = todo.id;
        var complete = todo.complete;
        var text = todo.text;
        var input;

        if (this.state.isEditing) {
            input =
                <TodoTextInput
                    className="edit"
                    onSave={this._onSave}
                    value={text}
                />;
        }

        return (
            <li
                className={cx({
                    'completed': complete,
                    'editing': this.state.isEditing
                })}
                key={id}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={complete}
                        onChange={this._onToggleComplete}
                    />
                    <label onDoubleClick={this._onDoubleClick}>
                        {text}
                    </label>
                    <button className="destroy" onClick={this._onDestroyClick} />
                </div>
                {input}
            </li>
        );
    },

    _onToggleComplete: function() {
        TodoActions.toggleComplete(this.props.todo);
    },

    _onDoubleClick: function() {
        this.setState({isEditing: true});
    },

    _onSave: function(text) {
        var id = this.props.todo.get('id');
        TodoActions.updateText(id, text);
        this.setState({isEditing: false});
    },

    _onDestroyClick: function() {
        var id = this.props.todo.get('id');
        console.log('destroy:' + id);
        TodoActions.destroy(id);
    }

});

module.exports = TodoItem;
