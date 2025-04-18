import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {NavItem, NavLink} from "reactstrap";

export class Pay extends Component {
    static displayName = Pay.name;

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: true,
            error: null,
            coinInputValues: {},
            availableCoins: []
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch('/api/basket/coin');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            this.setState({ products: data, loading: false }); // products — список монет
        } catch (error) {
            console.error('Ошибка при загрузке монет:', error);
            this.setState({ error, loading: false });
        }
    }

    // Функция для подсчета сдачи
    calculateChange(totalAmount, price) {
        const change = totalAmount - price;
        return change > 0 ? change : 0;
    }
    
    

    render() {
        const { products, loading, error, coinInputValues } = this.state;
        const { totalAmount } = this.props; // Получаем общую сумму из props
        
        

        if (loading) return <div className="p-3">Loading coins...</div>;
        if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

        const totalAmountUserHas = products.reduce((sum, coin) => {
            const quantity = parseInt(coinInputValues?.[coin.id] || 0, 10);
            return sum + coin.price * quantity;
        }, 0);

        const change = this.calculateChange(totalAmountUserHas, totalAmount);

        const canGive = this.props.canGiveChange(change, products, coinInputValues);


        return (
            <div className="p-4">
                <h2>Монеты</h2>
                <div> Итоговая сумма: {totalAmount} ₽
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                    {products.map((coin) => (
                        <div
                            key={coin.id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                background: '#f9f9f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <p><strong>Номинал:</strong> {coin.price} ₽</p>
                                <p><strong>В наличии:</strong> {coin.info} шт</p>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Количество"
                                    value={this.state.coinInputValues?.[coin.id] || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        this.setState((prevState) => ({
                                            coinInputValues: {
                                                ...prevState.coinInputValues,
                                                [coin.id]: value
                                            }
                                        }));
                                    }}
                                    style={{
                                        width: '80px',
                                        padding: '5px'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{
                    marginBottom: '20px',
                    fontWeight: 'bold',
                    color: totalAmountUserHas < totalAmount ? 'red' : 'green' // Условный выбор цвета
                }}
                >
                    Вы внесли: {totalAmountUserHas} ₽
                </div>
                <div style={{marginTop: '10px', fontWeight: 'bold'}}>
                    {change > 0 && (
                        canGive
                            ? <span style={{color: 'green'}}>Автомат может выдать сдачу</span>
                            : <span style={{color: 'red'}}>Автомат не может выдать сдачу</span>
                    )}
                </div>
                <div>
                    Ваша сдача: {change}
                </div>
            </div>
        );
    }
}