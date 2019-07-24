from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
from sqlalchemy.orm.exc import NoResultFound
from ..models import Stock
from ..forms import ValidationException
from .stock_form import StockForm

import json


ERROR_MESSAGES = {
    'stock_not_found': 'Stock Not Found!'
}


SUCCESS_MESSAGES = {
    'stock_created': "Stock was successfully created!",
    'stock_updated': "Stock was successfully updated!",
    'stock_deleted': "Stock was successfully deleted!"
}


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

    return {
        'stocks': stocks,
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

            form = StockForm(request.dbsession, stock, data=stock_form_data)
        except NoResultFound:
            return HTTPFound("{}?error=stock_not_found".format(request.route_url('home')))
    else:
        form = StockForm(request.dbsession)

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

    request.dbsession.query(Stock).filter(
        Stock.id == _id
    ).delete()

    return HTTPFound(request.route_url('home')+"?success=stock_deleted")
