import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {NavLink} from "reactstrap";

export class Counter extends Component {
  static displayName = Counter.name;

    constructor(props) {
        super(props);
        this.state = {
            myStateProducts: [],
            isLoading: false,
            error: null
        };
    }

    componentDidMount() {
        this.fetchMyStateProducts();
    }

    componentDidUpdate(prevProps) {
        // Если myState изменился, загружаем продукты заново
        if (prevProps.MyState !== this.props.MyState) {
            this.fetchMyStateProducts();
        }
    }
    

    fetchMyStateProducts = async () => {
        if (!this.props.MyState || this.props.MyState.length === 0) {
            this.setState({ myStateProducts: [] });
            return;
        }

        this.setState({ isLoading: true, error: null });

        try {
            const response = await fetch('/api/basket/by-ids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: this.props.MyState.map(item => item.id) }),

            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.setState({ myStateProducts: data, isLoading: false });
        } catch (error) {
            console.error('Error fetching basket products:', error);
            this.setState({
                error: 'Не удалось загрузить продукты',
                isLoading: false
            });
        }
        
        
        
    };
    
    

    render() {
        const { MyState, isLoading, error } = this.props;

        const total = MyState.reduce((sum, item) => sum + item.price * item.quantity, 0);


        if (isLoading) {
            return <div>Загрузка...</div>;
        }

        if (error) {
            return <div className="error">{error}</div>;
        }

        return (
            <div>
                <h2>Моя корзина</h2>

                {MyState.length > 0 ? (
                    <div>
                        {MyState.map(product => (
                            <div
                                key={product.id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    background: '#f9f9f9',
                                    marginTop: '20px',
                                    marginBottom: '10px'
                                }}
                            >
                                <h3>{product.info || 'Без названия'}</h3>
                                <p>Бренд: {product.brand}</p>
                                <p>Цена: {product.price} ₽</p>
                                <label>
                                    Количество:
                                    <input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={(e) => {
                                            const value = Math.max(1, Number(e.target.value));
                                            this.props.updateProductQuantity(product.id, value);
                                        }}
                                        style={{
                                            marginLeft: '10px',
                                            width: '60px',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc'
                                        }}
                                    />
                                </label>
                                <div style={{display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '10px'}}>
                                    <button
                                        onClick={() => this.props.addToMyState(product)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => this.props.removeItemFromMyState(product.id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#f39c12',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => this.props.removeFromMyState(product.id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={this.props.clearMyState}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '20px',
                                marginBottom: '10px'
                            }}
                        >
                            Очистить корзину
                        </button>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <div>
                                Общая сумма: {MyState.reduce((sum, item) => sum + item.price * item.quantity, 0)} ₽
                            </div>
                            {/*<button*/}
                            {/*    // onClick={this.props.clearMyState}*/}
                            {/*    style={{*/}
                            {/*        padding: '8px 16px',*/}
                            {/*        backgroundColor: '#4CAF50',*/}
                            {/*        color: 'white',*/}
                            {/*        border: 'none',*/}
                            {/*        borderRadius: '4px',*/}
                            {/*        marginTop: '10px',*/}
                            {/*        marginBottom: '10px',*/}
                            {/*        cursor: 'pointer'*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    Оплатить*/}
                            {/*</button>*/}
                            <NavLink
                                tag={Link}
                                to="/pay"
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginTop: '10px',
                                    marginBottom: '10px',
                                    cursor: 'pointer'
                                }}
                            >
                                Перейти к оплате
                            </NavLink>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>Ваша корзина пуста</p>
                    </div>

                )
                }
                <div style={{
                    padding: '10px',
                }}>
                    <NavLink
                        tag={Link}
                        className={`btn btn-primary`}
                        to="/"
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Вернуться
                    </NavLink>
                </div>
                
            </div>

        );
    }
}