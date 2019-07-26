import $ from 'jquery';


/**
 * Throttles a function to only be executed after a given wait period.  If multiple calls to the debounced function
 * are made within that period the waiting period is set.
 * @param fn
 * @param wait
 * @returns {Function}
 */
export function debounce(fn, wait) {
    let timeout;

    return function() {
        let args = arguments;

        let later = () => {
            timeout = null;
            fn.apply(this, args);
        };

        if(timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
    }
}



const TEMPLATE = `
<div class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Find Stock</h3>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <input type="text" name="search" class="form-control js-stock-search" placeholder="Search" />
                </div>
                <div>
                    <ul class="js-stock-output stock-list"></ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="js-stock-add-btn">Add</button>
                <button type="button" class="js-close-stock-picker-window">Close</button>
            </div>
        </div>
    </div>
</div>
`;


export default class StockPickerWindow {
    constructor(category) {
        this.$element = $(TEMPLATE);
        this.category = category;
        this.onSubmit = null;
        this.$search = this.$element.find('.js-stock-search');

        this.$search.on('keyup', debounce(async (event) => {
            let value = event.target.value;

            let response = await fetch('/ajax/stock/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'search': value,
                    'category': this.category || ''
                })
            });
            let data = await response.json();

            this.displayStocks(data.results);

        }, 500));

        this.stockOutput = this.$element.find('.js-stock-output');

        this.stockOutput.on('click', (event) => {
            let $target = $(event.target).closest('.stock-list-item');

            if(!$target[0]) return;

            this.stockOutput.find('.stock-list-item.selected').removeClass('selected');

            $target.addClass('selected');
        });

        this.$element.find('.js-stock-add-btn').on('click', (event) => {
            let selected = this.stockOutput.find('.stock-list-item.selected');

            let id = selected.data('id'),
                ticker = selected.text();

            if(this.onSubmit) {
                this.onSubmit({id, ticker});
            }

            this.close();
        });

        this.$element.find('.js-close-stock-picker-window').on('click', () => {
            this.close();
        });
    }

    appendTo(selector) {
        return this.$element.appendTo(selector);
    }

    remove() {
        return this.$element.remove();
    }

    clear() {
        this.stockOutput.empty();
        this.$search.val('');
    }

    open() {
        this.$element.modal('show');
    }

    close() {
        this.$element.modal('hide');
    }

    displayStocks(stocks) {
        let $output = this.$element.find('.js-stock-output');
        $output.empty();

        for(let stock of stocks) {
            $output.append(`<li class="stock-list-item" data-id="${stock.id}">${stock.ticker}</li>`);
        }

        console.log(stocks);
    }
}
