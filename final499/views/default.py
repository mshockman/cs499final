from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError
from ..models import Stock
from ..forms import FormField, Form, ValidationException, StringType, DecimalType

import json


ERROR_MESSAGES = {
    'stock_not_found': 'Stock Not Found!'
}


SUCCESS_MESSAGES = {
    'stock_created': "Stock was successfully created!",
    'stock_updated': "Stock was successfully updated!",
    'stock_deleted': "Stock was successfully deleted!"
}


STOCK_FIELDS = [
    FormField('ticker', 'Ticker', 'text', required=True, field_type=StringType(False, 1, 10)),
    FormField('sector', 'Sector', 'text', required=True, field_type=StringType(False, 1, 32)),
    FormField('change_from_open', 'Change from Open', 'number', required=True, field_type=DecimalType()),
    FormField('performance_ytd', 'Performance (YTD)', 'number', required=True, field_type=DecimalType()),
    FormField('performance_week', 'Performance (Week)', 'number', required=True, field_type=DecimalType()),
    FormField('performance_quarter', 'Performance (Quarter)', 'number', required=True, field_type=DecimalType()),
    FormField('simple_moving_average_200_day', '200-Day Simple Moving Average', 'number', required=True,
              field_type=DecimalType()),
    FormField('high_52_week', '52-Week High', 'number', required=True, field_type=DecimalType()),
    FormField('change', 'Change', 'number', required=True, field_type=DecimalType()),
    FormField('volatility_week', 'Volatility (Week)', 'number', required=True, field_type=DecimalType()),
    FormField('country', 'Country', 'text', field_type=StringType(max_length=3), required=True),
    FormField('low_50_day', '50-Day Low', 'number', required=True, field_type=DecimalType()),
    FormField('price', 'Price', 'number', required=True, field_type=DecimalType()),
    FormField('high_50_day', '50-Day High', 'number', required=True, field_type=DecimalType()),
    FormField('dividend_yield', 'Dividend Yield', 'number', required=True, field_type=DecimalType()),
    FormField('industry', 'Industry', 'text', required=True, field_type=StringType(min_length=1, max_length=32)),
    FormField('low_52_week', '52-Week Low', 'number', required=True, field_type=DecimalType()),
    FormField('average_true_range', 'Average True Range', 'number', required=True, field_type=DecimalType()),
    FormField('company', 'Company', 'text', required=True, field_type=StringType(min_length=1, max_length=32)),
    FormField('gap', 'Gap', 'number', required=True, field_type=DecimalType()),
    FormField('relative_volume', 'Relative Volume', 'number', required=True, field_type=DecimalType()),
    FormField('volatility_month', 'Volatility (Month)', 'number', required=True, field_type=DecimalType()),
    FormField('volume', 'Volume', 'number', required=True, field_type=DecimalType()),
    FormField('short_ratio', 'Short Ratio', 'number', required=True, field_type=DecimalType()),
    FormField('performance_half_year', 'Performance (Half Year)', 'number', required=True, field_type=DecimalType()),
    FormField('relative_strength_index_14', 'Relative Strength Index (14)', 'number', required=True,
              field_type=DecimalType()),
    FormField('simple_moving_average_20_day', '20-Day Simple Moving Average', 'number', required=True,
              field_type=DecimalType()),
    FormField('performance_month', 'Performance (Month)', 'number', required=True, field_type=DecimalType()),
    FormField('performance_year', 'Performance (Year)', 'number', required=True, field_type=DecimalType()),
    FormField('average_volume', 'Average Volume', 'number', required=True, field_type=DecimalType()),
    FormField('simple_moving_average_50_day', '50-Day Simple Moving Average', 'number', required=True,
              field_type=DecimalType()),
]


class StockForm(Form):
    def __init__(self, dbsession, model=None, *args, **kwargs):
        super().__init__(STOCK_FIELDS, *args, **kwargs)

        self.dbsession = dbsession
        self.model = model

        def validator(form, data):
            query = form.dbsession.query(Stock).filter(
                Stock.ticker == data['ticker']
            )

            if form.model and form.model.id:
                query = query.filter(
                    Stock.id != form.model.id
                )

            if query.count() > 0:
                raise ValidationException("Ticker must be unique!", form['ticker'])

        self.validator = validator

    def save(self, form_data):
        """
        Validates and updates stock model.
        :param form_data:
        :return:
        """
        stock = self.model if self.model else Stock()
        data = self.clean(form_data)
        Stock.import_from_dict(stock, data)
        self.dbsession.add(stock)

        return stock


@view_config(route_name='home', renderer='../templates/home.jinja2')
def my_view(request):
    stocks = request.dbsession.query(Stock).all()
    error = request.GET.get('error', None)
    success = request.GET.get('success', None)

    if error:
        if error in ERROR_MESSAGES:
            error = ERROR_MESSAGES[error]
        else:
            error = None

    if success:
        if success in SUCCESS_MESSAGES:
            success = SUCCESS_MESSAGES[success]
        else:
            success = None

    form = Form(STOCK_FIELDS)

    return {
        'stocks': stocks,
        'stock_form': form,
        'error': error,
        'success': success
    }


@view_config(route_name='import_stock_file')
def import_stock_file_view(request):
    """
    Imports a json file containing stock items into the stock table.
    :param request:
    :return:
    """
    stock_json_data = json.loads(request.POST['stocks'].file.read().decode('utf8'))

    for stock_data in stock_json_data:
        ticker = stock_data['Ticker']

        stock = request.dbsession.query(Stock).filter(
            Stock.ticker == ticker
        ).one_or_none()

        if stock is None:
            stock = Stock()

        Stock.import_json_data(stock, stock_data)
        request.dbsession.add(stock)

    return HTTPFound(request.route_url('home'))


@view_config(route_name="export_stock_file", renderer="json")
def export_stock_file_view(request):
    """
    Exports the stocks table into a json file.
    :param request:
    :return:
    """
    json_output = []

    stocks = request.dbsession.query(Stock).all()

    for stock in stocks:
        json_output.append(Stock.export_as_json_dict(stock))

    # Create response object.
    json_output = json.dumps(json_output)
    response = Response(
        content_type='application/json',
        content_disposition='attachment; filename=export.json',
        content_encoding='binary',
        content_length=len(json_output),
        body=json_output.encode('utf8')
    )

    return response


@view_config(route_name="stock", renderer="../templates/stocks.jinja2", request_method="GET")
def stock_view(request):
    _id = request.GET.get('id', None)

    if _id is not None:
        try:
            stock = request.dbsession.query(Stock).filter(
                Stock.id == _id
            ).one()

            stock_form_data = stock.as_dict()

            form = Form(STOCK_FIELDS, stock_form_data)
        except NoResultFound:
            return HTTPFound("{}?error=stock_not_found".format(request.route_url('home')))
    else:
        form = Form(STOCK_FIELDS)

    return {
        'form': form
    }


@view_config(route_name="stock", renderer="../templates/stocks.jinja2", request_method="POST")
def stock_view_post(request):
    _id = request.GET.get('id', None)
    success = "stock_created"

    if _id:
        try:
            stock = request.dbsession.query(Stock).filter(
                Stock.id == _id
            ).one()
            success = "stock_updated"
        except NoResultFound:
            return HTTPFound("{}?error=stock_not_found".format(request.route_url('home')))
    else:
        stock = Stock()

    form = StockForm(request.dbsession, stock)

    # Validate form.
    try:
        form.save(request.POST)
    except ValidationException as e:
        # Form validation failed.  Return form back to user with errors.
        return {
            'form': e.bound
        }

    return HTTPFound(request.route_url('home')+"?success="+success)


@view_config(route_name="delete_stock", request_method="POST")
def delete_stock_view(request):
    _id = request.GET['id']

    result = request.dbsession.query(Stock).filter(
        Stock.id == _id
    ).delete()

    return HTTPFound(request.route_url('home')+"?success=stock_deleted")