/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');

var Footer = React.createClass({

    propTypes: {
        allTodos: ReactPropTypes.object.isRequired
    },

    render: function() {
        var allTodos = this.props.allTodos;
        var total = Object.keys(allTodos).length;
        var completed = 0;

        if (total === 0) return null;
            for(var id in allTodos) {
                var todo = allTodos[id];
                if(todo.get('complete')) completed++;
            }

        var itemsLeft = total - completed;
        var itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
        itemsLeftPhrase += 'left';

        // completeのときはボタンを表示しない
        var clearCompletedButton;
        if (completed) {
            clearCompletedButton =
                <button
                    id="clear-completed"
                    onClick={this._onClearCompletedClick}>
                    Clear completed ({completed})
                </button>;
         }

        return (
            <footer id="footer">
                <span id="todo-count">
                    <strong>
                        {itemsLeft}
                    </strong>
                    {itemsLeftPhrase}
                </span>
                {clearCompletedButton}
            </footer>
        );
    },

    _onClearCompletedClick: function() {
        TodoActions.destroyCompleted();
    }

});

module.exports = Footer;
