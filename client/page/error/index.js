
import $ from 'jquery';

const cats = ["d", "e", "f"];
$('<h1>Cats1</h1>').appendTo('body');
const ul = $('<ul></ul>').appendTo('body');
for (const cat of cats) {
	$('<li></li>').text(cat).appendTo(ul);
}

module.exports = {a:2};