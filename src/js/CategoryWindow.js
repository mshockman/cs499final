import $ from 'jquery';
import StockPickerWindow from './StockPickerWindow';


const TEMPLATE = `
<div class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Add & Remove Stocks</h3>
            </div>
            <div class="modal-body">
                <div>
                    <div>
                        <div class="mb-2"><button type="button" class="js-add-stock-btn">Add Stock</button></div>
                        <table class="table js-stock-table table-bordered">
                            <thead>
                                <tr>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </th>
                            </thead>    
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="js-close-category-window">Close</button>
            </div>
        </div>
    </div>
</div>
`;



export default class CategoryWindow {
    constructor(id) {
        this.$element = $(TEMPLATE);
        this.id = id;
        this.stockPicker = new StockPickerWindow();
        this.stockPicker.appendTo(this.$element);
        this.$table = this.$element.find('.js-stock-table');
        this.$tbody = this.$table.find('tbody');

        this.$element[0].style.marginTop = '2rem';

        this.$element.find('.js-add-stock-btn').on('click', () => {
            this.stockPicker.clear();
            this.stockPicker.open();
        });

        this.stockPicker.onSubmit = async ({id, ticker}) => {
            await this.postStock(id, ticker);
        };

        this.$element.find('.js-close-category-window').on('click', () => {
            this.close();
        });

        this.loadCategory(id);
    }

    appendTo(selector) {
        return this.$element.appendTo(selector);
    }

    remove() {
        return this.$element.remove();
    }

    open() {
        this.$element.modal('show');
    }

    close() {
        this.$element.modal('hide');
    }

    addStock(stock_id, ticker) {
        this.$tbody.append(`<tr data-id="${stock_id}"><td>${ticker}</td><td><button type="button" data-action="remove">Remove</button></td></tr>`);
    }

    async postStock(stock_id, ticker) {
        console.log(this.id, stock_id, ticker);

        let response = await fetch('/ajax/category/add_stock', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                'category_id': this.id,
                'stock_id': stock_id
            })
        });
        let data = await response.json();

        // todo check for error

        this.addStock(stock_id, ticker);
    }

    emptyStocks() {
        this.$tbody.empty();
    }

    async loadCategory(id) {
        let response = await fetch(`/ajax/category/info?id=${id}`),
            data = await response.json();

        this.emptyStocks();

        for(let stock of data.stocks) {
            this.addStock(stock.stock_id, stock.ticker);
        }
    }
}
