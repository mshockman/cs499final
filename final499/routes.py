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

    config.add_route('test_api_page', '/test/api')
