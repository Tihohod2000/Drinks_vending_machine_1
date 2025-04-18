import React, { Component } from 'react';

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
                    <div style={{ margin: '10px' }}>
                        {MyState.map(product => (
                            <div
                                key={product.id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    background: '#f9f9f9',
                                    margin: '10px'
                                }}
                            >
                                <h3>{product.info || 'Без названия'}</h3>
                                <p>Бренд: {product.brand}</p>
                                <p>Цена: {product.price} ₽</p>
                                <p>Количество: {product.quantity}</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
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
                                marginTop: '20px'
                            }}
                        >
                            Очистить корзину
                        </button>
                        <div>
                            <div>
                                Общая сумма:
                            </div>
                            <div>
                                {MyState.reduce((sum, item) => sum + item.price * item.quantity, 0)} ₽
                            </div>
                            <button
                                // onClick={this.props.clearMyState}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Оплатить
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Ваша корзина пуста</p>
                )}
            </div>
        );
    }
}