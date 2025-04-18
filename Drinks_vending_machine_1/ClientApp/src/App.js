import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';

export default class App extends Component {
  static displayName = App.name;


    state = {
        MyState: []  // Теперь это часть состояния React
    };

    // Метод для обновления состояния
    addToMyState = (item) => {
        this.setState(prevState => ({
            MyState: [...prevState.MyState, item]
        }));
    };
    
    removeFromMyState = (itemId) => {
        this.setState(prevState => ({
            MyState: prevState.MyState.filter(id => id !== itemId)
        }));
    };

    clearMyState = () => {
        this.setState({ MyState: [] });
    };
    
    
  
  
  render() {
    return (
      <Layout>
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={React.cloneElement(element, {
                MyState: this.state.MyState,
                addToMyState: this.addToMyState,
                removeFromMyState: this.removeFromMyState,
                clearMyState: this.clearMyState
            })} />;
          })}
        </Routes>
      </Layout>
    );
  }
}
