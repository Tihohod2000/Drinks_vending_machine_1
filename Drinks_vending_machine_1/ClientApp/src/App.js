import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';

export default class App extends Component {
  static displayName = App.name;


    state = {
        MyState: [], // Теперь это часть состояния React
        otherProps: {},
    };

    addOtherProps = async (props) => {
        const otherProps = {};
        for (const [k,v] of Object.entries(props)) {
            otherProps[k] = v;
        }
        await this.setState({ otherProps });
    }
    // Метод для обновления состояния
    // Добавление товара в корзину
    addToMyState = (product) => {
        this.setState(prevState => {
            // Проверяем, есть ли товар уже в корзине
            const existingItemIndex = prevState.MyState.findIndex(
                item => item.id === product.id
            );
            
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


    // Рассчитываем общую сумму корзины
    calculateTotalAmount = () => {
        return this.state.MyState.reduce((sum, product) => sum + product.price * product.quantity, 0);
    };


    canGiveChange(change, products, coinInputValues) {
        const coins = products.map(coin => {
            const userAmount = parseInt(coinInputValues?.[coin.id] || 0, 10);
            return {
                ...coin,
                count: coin.info + userAmount  // общая доступность монет
            };
        });

        // Сортируем по убыванию номинала
        coins.sort((a, b) => b.price - a.price);

        let remaining = change;
        const changeGiven = [];  // сюда будем складывать выданные монеты

        for (const coin of coins) {
            const needed = Math.floor(remaining / coin.price);
            const used = Math.min(needed, coin.count);

            if (used > 0) {
                changeGiven.push({
                    id: coin.id,
                    price: coin.price,
                    count: used
                });
                remaining -= used * coin.price;
            }

            if (remaining === 0) break;
        }

        return {
            canGive: remaining === 0,
            changeGiven: remaining === 0 ? changeGiven : []
        };
    }
    
    
  
  
  render() {
      const totalAmount = this.calculateTotalAmount();
      
    return (
      <Layout>
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={React.cloneElement(element, {
                MyState: this.state.MyState,
                totalAmount,
                addToMyState: this.addToMyState,
                removeFromMyState: this.removeFromMyState,
                clearMyState: this.clearMyState,
                removeItemFromMyState: this.removeItemFromMyState,
                updateProductQuantity: this.updateProductQuantity,
                canGiveChange: this.canGiveChange,
                otherProps: this.state.otherProps,
                addOtherProps: this.addOtherProps,
            })} />;
          })}
        </Routes>
      </Layout>
    );
  }
}
