from sqlalchemy import Column, String, Integer, DateTime, func, DECIMAL
from .meta import Base
import decimal


class Stock(Base):
    """
    Model for stock table.  Contains info for stock information.
    """
    __tablename__ = "stock"

    # Used to map the keys in the json file
    # to the columns in the database during
    # file imports and exports.
    FILE_KEY_MAP = {
        'ticker': 'Ticker',
        'sector': 'Sector',
        'change_from_open': 'Change from Open',
        'performance_ytd': 'Performance (YTD)',
        'performance_week': 'Performance (Week)',
        'performance_quarter': 'Performance (Quarter)',
        'simple_moving_average_200_day': '200-Day Simple Moving Average',
        'high_52_week': '52-Week High',
        'change': 'Change',
        'volatility_week': 'Volatility (Week)',
        'country': 'Country',
        'low_50_day': '50-Day Low',
        'price': 'Price',
        'high_50_day': '50-Day High',
        'dividend_yield': 'Dividend Yield',
        'industry': 'Industry',
        'low_52_week': '52-Week Low',
        'average_true_range': 'Average True Range',
        'company': 'Company',
        'gap': 'Gap',
        'relative_volume': 'Relative Volume',
        'volatility_month': 'Volatility (Month)',
        'volume': 'Volume',
        'short_ratio': 'Short Ratio',
        'performance_half_year': 'Performance (Half Year)',
        'relative_strength_index_14': 'Relative Strength Index (14)',
        'simple_moving_average_20_day': '20-Day Simple Moving Average',
        'performance_month': 'Performance (Month)',
        'performance_year': 'Performance (Year)',
        'average_volume': 'Average Volume',
        'simple_moving_average_50_day': '50-Day Simple Moving Average'
    }

    id = Column(Integer(), primary_key=True, nullable=False, autoincrement=True, unique=True)
    created = Column(DateTime(), server_default=func.now())
    last_modified = Column(DateTime(), onupdate=func.now(), server_default=func.now())

    ticker = Column(String(10), nullable=False, unique=True)
    sector = Column(String(32), nullable=False, default="", server_default="")
    change_from_open = Column(DECIMAL(16, 4), nullable=False)
    performance_ytd = Column(DECIMAL(16, 4), nullable=False)
    performance_week = Column(DECIMAL(16, 4), nullable=False)
    performance_quarter = Column(DECIMAL(16, 4), nullable=False)
    simple_moving_average_200_day = Column(DECIMAL(16, 4), nullable=False)
    high_52_week = Column(DECIMAL(16, 4), nullable=False)
    change = Column(DECIMAL(16, 4), nullable=False)
    volatility_week = Column(DECIMAL(16, 4), nullable=False)
    country = Column(String(3), nullable=False)  # Country iso-3 code
    low_50_day = Column(DECIMAL(16, 4), nullable=False)
    price = Column(DECIMAL(16, 4), nullable=False)
    high_50_day = Column(DECIMAL(16, 4), nullable=False)
    dividend_yield = Column(DECIMAL(16, 4), nullable=False)
    industry = Column(String(32), nullable=False)
    low_52_week = Column(DECIMAL(16, 4), nullable=False)
    average_true_range = Column(DECIMAL(16, 4), nullable=False)
    company = Column(String(32), nullable=False)
    gap = Column(DECIMAL(16, 4), nullable=False)
    relative_volume = Column(DECIMAL(16, 4), nullable=False)
    volatility_month = Column(DECIMAL(16, 4), nullable=False)
    volume = Column(DECIMAL(16, 4), nullable=False)
    short_ratio = Column(DECIMAL(16, 4), nullable=False)
    performance_half_year = Column(DECIMAL(16, 4), nullable=False)
    relative_strength_index_14 = Column(DECIMAL(16, 4), nullable=False)
    simple_moving_average_20_day = Column(DECIMAL(16, 4), nullable=False)
    performance_month = Column(DECIMAL(16, 4), nullable=False)
    performance_year = Column(DECIMAL(16, 4), nullable=False)
    average_volume = Column(DECIMAL(16, 4), nullable=False)
    simple_moving_average_50_day = Column(DECIMAL(16, 4), nullable=False)

    def as_dict(self):
        r = {}

        for key in self.FILE_KEY_MAP.keys():
            r[key] = getattr(self, key)

        r['id'] = self.id
        r['created'] = self.created.strftime("%FT%H:%M:%SZ") if self.created else None
        r['last_modified'] = self.last_modified.strftime("%FT%H:%M:%SZ") if self.last_modified else None

        return r

    @classmethod
    def import_json_data(cls, stock, json_data):
        """
        Sets the attributes on the stock object given a dictionary of json data read from a imported file.
        :param stock:
        :param json_data:
        :return:
        """
        for attribute, key in cls.FILE_KEY_MAP.items():
            value = json_data[key]
            setattr(stock, attribute, value)

        return stock

    @classmethod
    def export_as_json_dict(cls, stock):
        """
        Takes a Stock model object and converts it into a dictionary object that is json serializable for file exports.
        :param stock: Stock
        :return:
        """
        ret = {}

        for attribute, key in cls.FILE_KEY_MAP.items():
            value = getattr(stock, attribute)

            if type(value) == decimal.Decimal:
                value = float(value)  # Decimals are not json serializable.

            ret[key] = value

        ret['id'] = stock.id

        # Datetime objects are not json serializable convert to string.
        ret['created'] = stock.created.strftime("%FT%H:%M:%SZ") if stock.created else None
        ret['last_modified'] = stock.last_modified.strftime("%FT%H:%M:%SZ") if stock.last_modified else None

        return ret

    @classmethod
    def import_from_dict(cls, stock, data):
        """
        Maps matching dictionary value to the stock object.

        :param stock:
        :param data:
        :return:
        """
        for key in cls.FILE_KEY_MAP.keys():
            setattr(stock, key, data[key])

        return stock
