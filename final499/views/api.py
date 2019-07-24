from pyramid.view import view_config
from sqlalchemy.orm.exc import NoResultFound
from ..models import Stock
from final499.views.stock_form import StockForm, ValidationException


@view_config(route_name="api_stocks_read", renderer="json")
def api_stocks_read_view(request):
    """
    Returns a single stock for the given ticker.

    :param request:
    :return:
    """
    try:
        stock = request.dbsession.query(Stock).filter(
            Stock.ticker == request.GET['ticker']
        ).one()
    except (KeyError, NoResultFound):
        request.response.status = 404

        return {
            'error': 'Stock not found!'
        }

    return Stock.export_as_json_dict(stock)


@view_config(route_name="api_stocks_create", renderer="json")
def api_stocks_create_view(request):
    """
    Creates a new stock entry.
    :param request:
    :return:
    """
    form = StockForm(request.dbsession)

    try:
        stock = form.save(request.json)
    except ValidationException as e:
        request.response.status = 400

        return {
            'status': 'error',
            'error': 'Validation Found!',
            'errors': e.as_dict()
        }

    return {
        'result': Stock.export_as_json_dict(stock)
    }


@view_config(route_name="api_stocks_update", renderer="json")
def api_stocks_update_view(request):
    """
    Updates an already existing stock entry.
    :param request:
    :return:
    """
    stock_data = request.json

    try:
        ticker = stock_data['ticker']

        if not ticker:
            raise KeyError()

        stock = request.dbsession.query(Stock).filter(Stock.ticker == ticker).one()
    except (KeyError, NoResultFound):
        request.response.status = 404
        return {
            'status': 'error',
            'error': 'Stock Not Found!'
        }

    form = StockForm(request.dbsession, model=stock)

    try:
        stock = form.save(request.json)
    except ValidationException as e:
        request.response.status = 400

        return {
            'status': 'error',
            'error': 'Validation Failed!',
            'errors': e.as_dict()
        }

    return {
        'result': Stock.export_as_json_dict(stock)
    }


@view_config(route_name="api_stocks_delete", renderer="json")
def api_stocks_delete_view(request):
    """
    Deletes one or more stock entries by ticker.
    :param request:
    :return:
    """
    tickers = request.GET.getall('tickers')

    results = request.dbsession.query(Stock).filter(
        Stock.ticker.in_(tickers)
    ).delete(synchronize_session=False)

    return {
        'deleted': results
    }


@view_config(route_name="api_stocks_list", renderer="json")
def api_stocks_list_view(request):
    """
    Lists one or more stock entries by ticker.
    :param request:
    :return:
    """
    """
    Returns a list of stocks for each ticker passed.
    :param request:
    :return:
    """
    tickers = request.GET.getall('tickers')
    results = []

    if tickers:
        query = request.dbsession.query(Stock).filter(
            Stock.ticker.in_(tickers)
        ).all()

        for stock in query:
            results.append(Stock.export_as_json_dict(stock))

    return {
        'results': results
    }


@view_config(route_name="api_stocks_top", renderer="json")
def api_stocks_top_view(request):
    """
    Returns the top 5 stocks for an industry.

    :param request:
    :return:
    """
    try:
        industry = request.GET['industry']
    except KeyError:
        request.response.status = 400
        return {
            'error': 'industry not set'
        }

    results = [
        Stock.export_as_json_dict(stock) for stock in request.dbsession.query(Stock).filter(
            Stock.industry == industry
        ).order_by(Stock.relative_strength_index_14.desc())[0:5]
    ]

    return {
        'results': results
    }


@view_config(route_name='test_api_page', renderer="../templates/test_api.jinja2")
def test_api_view(request):
    """
    Creates a view for testing the api.
    :param request:
    :return:
    """
    return {
        'form': StockForm(request.dbsession)
    }
