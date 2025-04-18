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
    // Добавление товара в корзину
    addToMyState = (product) => {
        this.setState(prevState => {
            // Проверяем, есть ли товар уже в корзине
            const existingItemIndex = prevState.MyState.findIndex(
                item => item.id === product.id
            );

            console.log("11");
            console.log(this.state);
            console.log("11");
            if (existingItemIndex >= 0) {
                // Если товар уже есть - увеличиваем количество
                const updatedItems = [...prevState.MyState];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1
                };
                return { MyState: updatedItems };
            } else {
                // Если товара нет - добавляем новый
                return {
                    MyState: [
                        ...prevState.MyState,
                        {
                            id: product.id,
                            name: product.name,
                            info: product.info,
                            price: product.price,
                            brand: product.brand.name,
                            quantity: 1
                        }
                    ]
                };
            }
        });
    };


    updateProductQuantity = (id, newQuantity) => {
        this.setState(prevState => ({
            MyState: prevState.MyState.map(product =>
                product.id === id ? { ...product, quantity: newQuantity } : product
            )
        }));
    }

    removeItemFromMyState = (itemId) => {
        this.setState(prevState => {
            // Находим индекс элемента в корзине
            const existingItemIndex = prevState.MyState.findIndex(
                item => item.id === itemId  // Исправлено: используем itemId вместо product.id
            );

            if (existingItemIndex >= 0) {  
                const item = prevState.MyState[existingItemIndex];

                
                if (item.quantity > 1) {
                    const updatedItems = [...prevState.MyState];
                    updatedItems[existingItemIndex] = {
                        ...item,
                        quantity: item.quantity - 1
                    };
                    return { MyState: updatedItems };
                }
                
                else{
                    return {
                        MyState: prevState.MyState.filter(item => item.id !== itemId)
                    };
                }
            }
            
            return prevState;
        });
    };
    
    removeFromMyState = (itemId) => {
        this.setState(prevState => ({
            MyState: prevState.MyState.filter(item => item.id !== itemId)
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
                clearMyState: this.clearMyState,
                removeItemFromMyState: this.removeItemFromMyState,
                updateProductQuantity: this.updateProductQuantity
            })} />;
          })}
        </Routes>
      </Layout>
    );
  }
}
