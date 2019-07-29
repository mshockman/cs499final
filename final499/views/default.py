from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
from sqlalchemy.orm.exc import NoResultFound
from ..models import Stock, Category
from ..forms import ValidationException
from .stock_form import StockForm
from ..accounts.decorators import account_login_required

import json


ERROR_MESSAGES = {
    'stock_not_found': 'Stock Not Found!',
    'category_not_found': 'Category Not Found!'
}


SUCCESS_MESSAGES = {
    'stock_created': "Stock was successfully created!",
    'stock_updated': "Stock was successfully updated!",
    'stock_deleted': "Stock was successfully deleted!"
}


@view_config(route_name='home', renderer='../templates/home.jinja2')
@account_login_required
def list_stocks_view(request):
    error = request.GET.get('error', None)
    success = request.GET.get('success', None)
    category_id = request.GET.get('category', None)

    if not category_id:
        stocks = request.dbsession.query(Stock).all()
    else:
        try:
            category = request.dbsession.query(Category).filter(
                Category.id == category_id
            ).one()

            stocks = [stock.stock for stock in category.stocks]
        except NoResultFound:
            stocks = request.dbsession.query(Stock).all()
            error = 'category_not_found'

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
@account_login_required
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
@account_login_required
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
@account_login_required
def stock_view(request):
    """
    View for viewing a single stock.

    :param request:
    :return:
    """
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
@account_login_required
def stock_view_post(request):
    """
    View for creating or updating stock information.

    :param request:
    :return:
    """
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
@account_login_required
def delete_stock_view(request):
    """
    View for deleting a stock.

    :param request:
    :return:
    """
    _id = request.GET['id']

    request.dbsession.query(Stock).filter(
        Stock.id == _id
    ).delete()

    return HTTPFound(request.route_url('home')+"?success=stock_deleted")
