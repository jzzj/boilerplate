let components = {};

/*
pipe like: 
{
  targetName: {
    child1Name: [],
    child2Name: [],
    child3Name: [],
  }
}
*/
let pipe = {};

/*
orders like: 
{
  targetName: [child1Name, child2Name, child3Name]
}
*/
let orders = {};
window.orders = orders;
window.pipe = pipe;
/*
    CHILDREN                 REDUCER                 PARENT
 根据用户点击触发向      收到push过来的渲染方法，      被动触发渲染方法，
reducer中push对应的     存储在目标组件的管道中，   从管道中拉取对应渲染好的元素
    渲染方法            触发目标组件的渲染方法      触发渲染，re-render
                                                ORDER DOES MATTER!    

*/

export default class ReactLevelReducer {

  static getComponentInstance = getComponentInstance;

  static getComponentName = getComponentName;

  static register = register;

  static getElementsFromPipe = getElementsFromPipe;

  constructor(component){
    this.component = component;
    register(component);
  }

  /*
  * @params componentName, ...renderMethods
  * renderMethods could be function or react-elems
  */
  renderTo(componentName, ...renderMethods){
    const targetComponent = getComponentInstance(componentName);
    if(targetComponent == null){
      throw new Error('The target component: ['+ componentName +'] has not been registered! Please call ReactLevelReducer.register(componentInstance) to register the component.');
    }else{
      const currentName = getComponentName(this.component);
      let pipeline = pipe[componentName];
      let order = orders[componentName];
      if(!pipeline){
        pipe[componentName] = pipeline = {};
      }
      if(!order){
        orders[componentName] = order = [];
      }

      // reset pipeline to empty
      let currentPipe = pipeline[currentName] = [];

      // resort the order of target component
      resort(order, currentName);

      renderMethods.forEach(method=>{
        let elem;
        if(typeof method === 'function'){
          elem = method.call(this.component);
        }else{
          elem = method;
        }
        currentPipe.push(elem);
      });

      if(targetComponent.onRecieveLevelReduce){
        targetComponent.onRecieveLevelReduce.call(targetComponent, currentName);
      }else{
        console.error("Target component:["+ componentName +"] does not provide a method called onRecieveLevelReduce, please check!");
      }
    }
  }

  getElementsFromPipe(){
    const currentName = getComponentName(this.component);
    return getElementsFromPipe(currentName);
  }
}

function getElementsFromPipe(currentName){
  currentName = getComponentName(currentName);
  const pipeline = pipe[currentName];
  const order = orders[currentName] || [];
  let result = [];
  for(let i=0, len=order.length; i<len; i++){
    result = result.concat(pipeline[order[i]]);
  }
  return result;
}

function resort(order, name){
  const idx = order.indexOf(name);
  if(idx !== -1){
    order.splice(idx, 1);
  }
  order.push(name);
  return order;
}

function register(component, Constructor){
  if(typeof Constructor === 'function'){
    components[component] = Constructor;
  }else{
    const componentName = getComponentName(component);
    if(!componentName){
      throw new Error("Name of component is required! Please checkout ["+ component +"] .");
    }else if(/default/.test(componentName)){
      throw new Error("You are useing the default name, that highly not recommended! Please checkout ["+ component.constructor.toString() +"] .");
    }else{
      components[componentName] = component;
    }
  }
}

function getComponentName(component){
  if(typeof component === 'string'){
    return component;
  }
  const constructor = component.constructor;
  return constructor.name || constructor.displayName;
}

function getComponentInstance(componentName){
  if(!componentName)throw new Error('Required componentName!');
  return components[componentName] || null;
}