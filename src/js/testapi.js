import '@babel/polyfill';


/**
 * Controls test tabs.
 */
class Tabs {
    constructor(selector) {
        this.bar = $(selector);
        this.tabs = this.bar.find('.tab-btn');

        this.bar.on('click', (event) => {
            let target = $(event.target).closest('.tab-btn', this.bar),
                tab = Tabs.getTabId(target);

            if(target) {
                this.tabs.removeClass('active');
                target.addClass('active');

                for(let tab of this.tabs) {
                    let tabId = Tabs.getTabId(tab);
                    $(tabId).removeClass('open');
                }

                $(tab).addClass('open');
            }
        });
    }

    static getTabId(element) {
        if(element.jquery) {
            return element.data('tab');
        } else {
            return element.dataset.tab;
        }
    }
}


function csvToQueryString(key, csv) {
    csv = csv.split(/\s*,\s*/);
    let params = [];

    for(let item of csv) {
        params.push(`${key}=${item}`);
    }

    return params.join('&');
}


async function apiReadTest() {
    let $context = $("#read_test"),
        tickerField = $context.find('[name="ticker"]'),
        ticker = tickerField.val();

    let url = `/api/stocks/read?ticker=${ticker}`;

    let response = await fetch(url),
        results = await response.json();

    $('#output').text(JSON.stringify(results));
}


async function apiListTest() {
    let $context = $("#list_test"),
        tickers = $context.find("[name='tickers']").val(),
        params = csvToQueryString('tickers', tickers);

    let url = `/api/stocks/list?${params}`;

    let response = await fetch(url),
        results = await response.json();

    $('#output').text(JSON.stringify(results));
}


async function apiTopTest() {
    let $context = $("#top_test"),
        industry = $context.find("[name='industry']").val();

    let url = `/api/stocks/top?industry=${industry}`;

    let response = await fetch(url),
        results = await response.json();

    $('#output').text(JSON.stringify(results));
}


function getFormData($context) {
    let r = {};

    $context.find('form input').each((index, element) => {
        if(element.name) {
            r[element.name] = $(element).val();
        }
    });

    return r;
}


async function apiCreateTest() {
    let $context = $('#create_test'),
        data = getFormData($context),
        url = `/api/stocks/create`;

    let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }),
        results = await response.json();

    $('#output').text(JSON.stringify(results));
}


async function apiUpdateTest() {
    let $context = $('#update_test'),
        data = getFormData($context),
        url = `/api/stocks/update`;

    let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }),
        results = await response.json();

    $('#output').text(JSON.stringify(results));
}


async function apiDeleteTest() {
    let $context = $('#delete_test'),
        tickers = $context.find("[name='tickers']").val(),
        params = csvToQueryString('tickers', tickers);

    let url = `/api/stocks/delete?${params}`;

    let response = await fetch(url),
        results = await response.json();

    $('#output').text(JSON.stringify(results));
}


$(function() {
    new Tabs("#tabbar");

    $("#update_test .modal-title").text("Update Stock");
    $("#update_test form").prop('action', 'javascript:void(0)');
    $("#update_test form button").remove();

    $("#create_test form").prop('action', 'javascript:void(0)');
    $("#create_test form button").remove();

    $('#api-read-btn').on('click', apiReadTest);
    $('#api-list-btn').on('click', apiListTest);
    $('#api-top-btn').on('click', apiTopTest);
    $('#api-create-btn').on('click', apiCreateTest);
    $('#api-update-btn').on('click', apiUpdateTest);
    $('#api-delete-btn').on('click', apiDeleteTest);
});