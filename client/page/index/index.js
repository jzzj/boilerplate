import $ from 'jquery';
import React, {Component} from 'react';
import {render} from 'react-dom';
import List from '@client/component/List';
import ReactLevelReducer from '@lib/react-level-reducer';



class App extends Component{

  constructor(){
    super();
    this.state = {
      msg: 12312,
      list: "akljdjlfasjjkfjklaskfdjkalsjkfjjklsa".split("a"),
      elements: []
    }
    ReactLevelReducer.register(this);
  }

  changeState(){
    const msg = "new msg";
    this.state.list.push("aaaa");
    this.setState({
      list: this.state.list,
      msg
    })
  }

  onRecieveLevelReduce(){
    this.setState({
      elements: ReactLevelReducer.getElementsFromPipe(this)
    });
  }

  render(){
    const {msg, list, elements} = this.state;

    return (
      <div>
        <ul>
          {
            list.map((item, idx)=>{
              return (
                <li key={idx}>{item}</li>
              )
            })
          }
        </ul>
        <button onClick={this.changeState.bind(this)}>Click Me</button>
        <div>
          <SubPage msg={1}/>
        </div>
        {
          elements.map(i=>i)
        }
      </div>
    );
  }
}

class SubPage extends Component {
  constructor(){
    super();
    this.state = {
      msg: "subpage msg"
    }
    this.levelReducer = new ReactLevelReducer(this);
  }

  levelLessSomethingRender(){
    return <div key="SubPage-something">somthing</div>
  }

  onRenderToParent(){
    this.levelReducer.renderTo('App', this.levelLessSomethingRender);
  }

  render(){
    console.log("subpage render");
    return (
      <div>
        <p>I am subpage</p>
        <p>this is prop from Parent Component: {this.state.msg}</p>
        <p><button onClick={this.onRenderToParent.bind(this)}>Click me will re-render root page!</button></p>
        <div>------------------------------------------</div>
        <div>
          <GrandsonPage/>
        </div>
      </div>
    );
  }
}

class GrandsonPage extends Component {
  constructor(){
    super();
    this.state = {
      msg: "GrandsonPage msg"
    };
    this.levelReducer = new ReactLevelReducer(this);
  }

  // 将元素渲染在父祖级组件的方法命名规范：levelLessXxxRender
  levelLessDialogRender(){
    return (
      <div key="GrandsonPage-dialog">
        levelLessRenderDialog element
      </div>
    )
  }

  onRenderToParent(){
    this.levelReducer.renderTo("App", this.levelLessDialogRender);
  }

  onRecover(){
    this.levelReducer.renderTo("App", null);
  }

  render(){
    console.log("GrandsonPage render");
    return (
      <div>
        <p>I am GrandsonPage</p>
        <p><button onClick={this.onRenderToParent.bind(this)}>Click me will re-render root page!</button></p>
        <p><button onClick={this.onRecover.bind(this)}>Click me will recover the root page!</button></p>
      </div>
    );
  }
}

typeof document !== 'undefined' && render(<App />, document.getElementById('app'));
