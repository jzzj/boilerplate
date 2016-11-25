import $ from 'jquery';
import React, {Component} from 'react';
import {render} from 'react-dom';
import List from '@client/component/List'
import './index.scss'


typeof document !== 'undefined' && render(<List />, document.getElementById('app'));


const cats = ["a", "b", "c"];
$('<h1>Cats</h1>').appendTo('body');
const ul = $('<ul></ul>').appendTo('body');
for (const cat of cats) {
	$('<li></li>').text(cat).appendTo(ul);
}