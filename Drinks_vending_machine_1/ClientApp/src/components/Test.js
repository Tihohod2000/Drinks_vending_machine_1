import React, { Component } from 'react';

export class Test extends Component {
    static displayName = Test.name;

    render() {
        const { changeGiven } = this.props; // Получаем changeGiven через props

        return (
            <div className="p-4">
                <h2>Выданная сдача</h2>
                {changeGiven.length > 0 ? (
                    <ul>
                        {changeGiven.map((coin, index) => (
                            <li key={index}>
                                {coin.count} шт по {coin.price} ₽
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>Сдача не выдана</div>
                )}
            </div>
        );
    }
}
