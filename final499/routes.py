def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)

    config.add_route('home', '/')
    config.add_route('import_stock_file', '/import-file')
    config.add_route('export_stock_file', '/export-file')

    config.add_route('stock', '/stock')
    config.add_route('delete_stock', '/delete-stock')

    config.add_route('api_stocks_read', '/api/stocks/read')
    config.add_route('api_stocks_create', '/api/stocks/create')
    config.add_route('api_stocks_update', '/api/stocks/update')
    config.add_route('api_stocks_delete', '/api/stocks/delete')
    config.add_route('api_stocks_list', '/api/stocks/list')
    config.add_route('api_stocks_top', '/api/stocks/top')

    config.add_route('category_view', '/category/view')
    config.add_route('ajax_create_category', '/ajax/category/create')
    config.add_route('ajax_remove_category', '/ajax/category/remove')
    config.add_route('ajax_stock_search', '/ajax/stock/search')
    config.add_route('ajax_get_category_view', '/ajax/category/info')
    config.add_route('ajax_add_stock_to_category', '/ajax/category/add_stock')

    config.add_route('test_api_page', '/test/api')
