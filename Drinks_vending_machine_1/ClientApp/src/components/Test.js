import React, { Component } from 'react';

export class Test extends Component {
    static displayName = Test.name;

    constructor(props) {
        super(props);
        this.state = {
            myStateProducts: [],
            isLoading: false,
            error: null
        };
    }

    render() {
        const { changeGiven } = this.props; // Получаем changeGiven через props
        
        
        console.log(this.props);

        return (
            <div className="p-4">
                <h2>Выданная сдача</h2>
                {/*{changeGiven.length > 0 ? (*/}
                {/*    <ul>*/}
                {/*        {changeGiven.map((coin, index) => (*/}
                {/*            <li key={index}>*/}
                {/*                {coin.count} шт по {coin.price} ₽*/}
                {/*            </li>*/}
                {/*        ))}*/}
                {/*    </ul>*/}
                {/*) : (*/}
                {/*    <div>Сдача не выдана</div>*/}
                {/*)}*/}
            </div>
        );
    }
}
