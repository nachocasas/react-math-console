import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      logs: [],
      pastValues: [],
      pastValuesPos: 0,
      value : '',
      clearOnNextDownPress: false
    }

  }

  componentDidMount(){
    const initialMessage = <span>Start typing the operations at the bottom of the screen</span>;
    this.setState({ logs : [initialMessage]});
    this.input.focus();
  }

  handleTextChange = (event) => {
    const value = event.target.value;
    this.setState({ value });
  }

  handleKeyDown = (event) => {
    const { pastValues, pastValuesPos, clearOnNextDownPress } = this.state;
    const lastPosition = pastValues.length - 1;
    let newPastValuesPos = pastValuesPos;
    let newValue = '';
    let clear = false;

    switch(event.key) {
      
      case 'ArrowUp':
        newPastValuesPos = pastValuesPos > 0 ? pastValuesPos - 1 : 0;
        this.setState( { value: pastValues[newPastValuesPos], pastValuesPos: newPastValuesPos, clearOnNextDownPress : clear} );
      break;
      
      case 'ArrowDown':
        if(pastValuesPos < lastPosition){
          newPastValuesPos = pastValuesPos + 1;
          newValue = pastValues[newPastValuesPos];
          clear = (newPastValuesPos === lastPosition)
        } 
        if(clearOnNextDownPress){
          newValue = '';
          newPastValuesPos = pastValuesPos + 1;
        }
        this.setState( { value: newValue, pastValuesPos: newPastValuesPos, clearOnNextDownPress : clear} );
      break;
      
      case 'Enter':
        this.submit();
      break;

      default:
      break;
    }
  }

  submit = () => {
    const { logs, value, pastValues } = this.state;
    
    if(value.trim() === '') return;

    const message = this.processInput(value);
    pastValues.push(value);
    logs.push(message);

    this.setState({
      value: '',
      pastValues,
      pastValuesPos: pastValues.length,
      logs,
    })
  }

  processInput(value){
    let message = '';

    try {
      const result = eval(value);
      message = <span>{value}: {result}</span>;
    } catch(e){
      message = <span className='error'>operation "{value}" returned an error! - Please check and try again</span>;
    }

    return message
  }

  renderListItem(items){
   return items.map((item, index) => {
     return <li key={index}> &gt; {item}</li>
   })
  }

  render() {
    const { logs } = this.state;
    const listItems = this.renderListItem(logs);

    return (
      <div className="App">
        <div className="log-box">
          <ul>
            { listItems }
          </ul>
        </div>
        <div className="form-container">
          <input 
          ref = {(ref) => this.input = ref }
          value={ this.state.value } 
          onKeyDown={ this.handleKeyDown } 
          onChange={ this.handleTextChange } 
          placeholder="Enter an expression" />
        </div>
      </div>
    );
  }
}

export default App;
