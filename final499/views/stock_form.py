from ..forms import FormField, Form, ValidationException, StringType, DecimalType
from ..models import Stock


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

            return data

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
