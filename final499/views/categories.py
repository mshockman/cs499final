from pyramid.view import view_config
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError
from ..models import Category, Stock, CategoryStock
from zope.sqlalchemy import mark_changed
from ..accounts.decorators import account_login_required

import transaction


@view_config(route_name="category_view", renderer="../templates/browse_category.jinja2")
@account_login_required
def browse_categories_view(request):
    """
    View for browsing categories.
    :param request:
    :return:
    """
    return {
        'categories': Category.get_full_category_tree(request.dbsession)
    }


@view_config(route_name="ajax_create_category", renderer="json")
@account_login_required
def ajax_create_category_view(request):
    """
    Ajax view that allows the user to create a category.
    :param request:
    :return:
    """
    parent_id = request.json.get('parent', None)
    name = request.json['name']
    parent = None

    if parent_id:
        try:
            parent = request.dbsession.query(Category).filter(
                Category.id == parent_id
            ).one()
        except NoResultFound:
            request.response.status = 400
            return {
                'error': "Parent could not be found!"
            }

    if parent:
        category = Category()
        category.name = name

        parent.append_child_category(request.dbsession, category)

        return {
            'name': category.name,
            'parent_id': category.parent_category_id,
            'id': category.id
        }
    else:
        category = Category.create_root_category(request.dbsession, name)

        return {
            'name': category.name,
            'id': category.id,
            'parent_id': None
        }


@view_config(route_name="ajax_remove_category", renderer="json")
@account_login_required
def ajax_remove_category(request):
    """
    Ajax view that allows the user to remove a category.
    :param request:
    :return:
    """
    _id = request.json.get('id', None)
    delete_all = request.json.get('deleteAll', False)

    if not _id and delete_all:
        request.dbsession.query(Category).delete()
        transaction.commit()

        return {
            'success': True,
            'deleted': 'all'
        }
    else:
        try:
            category = request.dbsession.query(Category).filter(
                Category.id == _id
            ).one()
        except NoResultFound:
            request.response.status = 400
            return {
                'error': 'Category not Found!'
            }

        category.remove(request.dbsession)
        mark_changed(request.dbsession)

        return {
            'success': True,
            'deleted': _id
        }


@view_config(route_name="ajax_stock_search", renderer="json")
@account_login_required
def ajax_stock_search_view(request):
    """
    Ajax view for find a stock.

    :param request:
    :return:
    """
    search = request.json['search']

    stocks = request.dbsession.query(Stock).filter(
        Stock.ticker.ilike('%%%s%%' % search)
    )[0:20]

    results = [
        {
            'ticker': stock.ticker,
            'id': stock.id,
        } for stock in stocks
    ]

    return {
        'results': results
    }


@view_config(route_name="ajax_get_category_view", renderer='json')
@account_login_required
def ajax_get_category_info_view(request):
    """
    Ajax view for getting category info.

    :param request:
    :return:
    """
    _id = request.GET['id']

    category = request.dbsession.query(Category).filter(
        Category.id == _id
    ).one()

    return category.as_dict()


@view_config(route_name="ajax_add_stock_to_category", renderer="json")
@account_login_required
def ajax_add_stock_to_category(request):
    """
    Ajax view for adding a stock to a category.

    :param request:
    :return:
    """
    try:
        category_stock = CategoryStock()
        category_stock.stock_id = request.json['stock_id']
        category_stock.category_id = request.json['category_id']
        request.dbsession.add(category_stock)
        request.dbsession.flush()

        return {
            'id': category_stock.id
        }
    except IntegrityError:
        request.response.status = 400
        return {
            'error': "Stock already in category!"
        }
