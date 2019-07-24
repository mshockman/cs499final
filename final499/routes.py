def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)

    config.add_route('home', '/')
    config.add_route('import_stock_file', '/import-file')
    config.add_route('export_stock_file', '/export-file')

    config.add_route('stock', '/stock')
    config.add_route('delete_stock', '/delete-stock')
