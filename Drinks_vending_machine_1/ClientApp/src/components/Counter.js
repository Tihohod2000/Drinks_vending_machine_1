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
                body: JSON.stringify({ ids: this.props.MyState }),
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
        const { myStateProducts, isLoading, error } = this.state;

        if (isLoading) {
            return <div>Загрузка...</div>;
        }

        if (error) {
            return <div className="error">{error}</div>;
        }

        return (
            <div>
                <h2>Моя корзина</h2>

                {myStateProducts.length > 0 ? (
                    <div style={{
                        // display: 'grid',
                        // gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        // gap: '20px'
                    }}>
                        {myStateProducts.map(product => (
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
                                {product.brand && <p>Бренд: {product.brand.name}</p>}
                                <p>Цена: {product.price} ₽</p>
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
                        ))}
                    </div>
                ) : (
                    <p>Ваша корзина пуста</p>
                )}
            </div>
        );
    }
}