import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {NavItem, NavLink} from "reactstrap";

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: true,
            error: null,
            addedProductIds: []
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch('http://localhost:8080/api/basket');

            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            this.setState({ products: data, loading: false });
        } catch (error) {
            this.setState({ error, loading: false });
        }
    }

    handleAddToCart = async (product) => {
        try {
            // const response = await fetch('http://localhost:8080/api/basket/add', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ productId: product.id, }) // можно передать только id, если API ожидает его
            // });

            // if (!response.ok) {
            //     throw new Error(`Failed to add to cart: ${response.status}`);
            // }

            // const result = await response.json();
            // console.log('Added to cart:', result);

            // this.setState(prevState => ({
            //     addedProductIds: [...prevState.addedProductIds, product.id]
            // }));

            // console.log(this.props)
            // this.props["MyState"].push(product.id)
            this.props.addToMyState(product);
            console.log(this.props)

            alert(`Товар "${product.brand.name}" добавлен в корзину!`);
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Не удалось добавить товар в корзину.');
        }
    }

    render() {
        const { products, loading, error, addedProductIds } = this.state;
        console.log('Rendering with products:', this.state.products);

        if (loading) return <div className="p-3">Loading products...</div>;
        if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

        return (
            <div className="p-4">
                <h1>Vending Machine Products</h1>
                <NavLink
                    tag={Link}
                    className={`btn btn-primary ${this.props.MyState.length <= 0 ? 'disabled' : ''}`}
                    to="/counter"
                    aria-disabled={this.props.MyState.length <= 0}
                >
                    Добавлено: {this.props.MyState.length}
                </NavLink>
                <div className="mt-3">
                    {products.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '20px'
                        }}>
                            {products.map(product => {
                                const isAdded = this.props.MyState.some(item => item.id === product.id);


                                return (
                                    <div key={product.id} style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        background: '#f9f9f9'
                                    }}>
                                        <p>{product.info || 'No info'}</p>
                                        <p>{product.brand.name}</p>
                                        <p>Цена: {product.price} ₽.</p>
                                        <button
                                            style={{
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                padding: '15px',
                                                backgroundColor: isAdded ? '#ccc' : '#fff',
                                                color: isAdded ? '#666' : '#000',
                                                cursor: isAdded ? 'not-allowed' : 'pointer'
                                            }}
                                            disabled={isAdded}
                                            onClick={() => this.handleAddToCart(product)}
                                        >
                                            {isAdded ? 'Добавлен' : 'Добавить'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
        );
    }
}
