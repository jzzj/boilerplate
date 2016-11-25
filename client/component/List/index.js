import React, {Component} from 'react';

export default class extends Component{
	constructor(){
		super();
		this.list = "1-2-3-4-5-6".split("-");
	}

	render(){
		return (
			<ul>
				{
					this.list.map((item, idx)=>
						<li key={idx}>{item}</li>)
				}
			</ul>
		)
	}
}