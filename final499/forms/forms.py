from collections import OrderedDict
import decimal


class ValidationException(Exception):
    def __init__(self, msg, bound=None, value=None):
        super().__init__(msg)
        self.nodes = OrderedDict()
        self.bound = bound
        self.value = value

    def add_error(self, validation_error):
        if validation_error.bound.name not in self.nodes:
            self.nodes[validation_error.bound.name] = []

        self.nodes[validation_error.bound.name].append(validation_error)

    def get_field_error_list(self, field_name):
        if field_name in self.nodes:
            return self.nodes[field_name]
        else:
            return []


# Used to mark that a field should be dropped.
DROP = object()


class StringType:
    def __init__(self, empty=False, min_length=None, max_length=None):
        self.empty = empty
        self.min_length = min_length
        self.max_length = max_length

    def __call__(self, value):
        value = str(value)

        if value == "" and self.empty is False:
            raise ValidationException("Field cannot be empty")
        elif value == "":
            return value

        if self.min_length is not None and len(value) < self.min_length:
            raise ValidationException("Value below minimum length")

        if self.max_length is not None and len(value) > self.max_length:
            raise ValidationException("Value above maximum length")

        return value


class DecimalType:
    def __init__(self, max_value=None, min_value=None):
        self.max_value = max_value
        self.min_value = min_value

    def __call__(self, value):
        try:
            value = decimal.Decimal(value)
        except (TypeError, ValueError, decimal.InvalidOperation):
            raise ValidationException("Value is not decimal")

        if self.max_value is not None and self.max_value < value:
            raise ValidationException("Value exceeds maximum limit")

        if self.min_value is not None and self.min_value > value:
            raise ValidationException("Value is below minimum limit")

        return value


class FormField:
    """
    Helper class that is used to display and validate form fields.
    """
    def __init__(self, name, label, input_type, validator=None, field_type=None, missing=ValidationException,
                 nullable=ValidationException, required=False):
        # The name of the field.
        self.name = name

        # The label used in the html form.
        self.label = label

        # A callable that is used to cast the value into a given type.
        # Should return the new value on success.  If anything goes wrong
        # it should throw a ValidationError.
        self.input_type = input_type

        # A callable that is used to validate the object.
        # Should raise a ValidationException if validation fails.
        self.validator = validator

        # A function that is used to cast the value into the right type.
        # Should return a validation error if something goes wrong.
        self.field_type = field_type

        # Controls how missing properties are handled.  Can be used to set
        # a default value by setting it to anything other then a few special
        # values.  If set ValidationException a validation error will be raised
        # if the value is missing.  If set the DROP object the value will be dropped
        # from the final output.
        self.missing = missing

        # Controls how None values are handled.  If None they are allowed as is, if ValidationException a
        # ValidationException is raised, if DROP they are dropped.  If anything else it is used as the
        # default value.
        self.nullable = nullable

        # If true empty values are not allowed and a validation error is raised.
        self.required = required

    def __call__(self, form_data):
        # Handle missing keys.
        if self.name not in form_data:
            if self.missing is DROP:
                return DROP
            elif self.missing is ValidationException:
                raise ValidationException("Value is required", bound=self)

            return self.missing

        value = form_data[self.name]

        if not value and self.required:
            raise ValidationException("Value is required", bound=self)

        # Handle null values.
        if value is None:
            if self.nullable is ValidationException:
                raise ValidationException("Value cannot be None", bound=self)

            return self.nullable

        # Convert type
        if self.field_type is not None:
            try:
                value = self.field_type(value)
            except ValidationException as e:
                e.bound = self
                e.value = value
                raise e

        # Run validator function.
        if self.validator is not None:
            try:
                self.validator(value)
            except ValidationException as e:
                # Attach field to error and raise again.
                e.bound = self
                e.value = value
                raise e

        return value


class BoundField:
    def __init__(self, form, field):
        self.form = form
        self.field = field

    def clean(self, form_data):
        return self.field(form_data)

    @property
    def name(self):
        return self.field.name

    @name.setter
    def name(self, name):
        self.field.name = name

    @property
    def label(self):
        return self.field.label

    @label.setter
    def label(self, value):
        self.field.label = value

    @property
    def value(self):
        if self.form.data:
            return self.form.data.get(self.field.name, None)

    @property
    def id(self):
        if self.form.prefix:
            return "{}id-{}".format(self.form.prefix, self.field.name)
        else:
            return "id-{}".format(self.field.name)

    @property
    def errors(self):
        """
        Returns a list of validation errors for the field.
        :return:
        """
        if self.form.errors:
            return self.form.errors.get_field_error_list(self.field.name)
        else:
            return []


class Form:
    def __init__(self, fields, data=None, prefix=None, validator=None, name="__form__"):
        self.fields = OrderedDict()
        self.data = data
        self.errors = None

        # Used to keep consistancy with field nodes.
        self.name = name

        # Form level validation
        self.validator = validator

        # Prefixes the automatically generated ids.
        self.prefix = prefix

        for field in fields:
            field = BoundField(self, field)
            self.fields[field.name] = field

    def clean(self, form_data):
        r = {}
        error = None

        # Validate every field.
        for field in self.fields.values():
            try:
                value = field.clean(form_data)

                if value is not DROP:
                    r[field.field.name] = value
            except ValidationException as e:
                if error is None:
                    error = ValidationException('Form Validation Failed')

                error.add_error(e)

        # Run form level validator.
        if self.validator is not None:
            try:
                form_data = self.validator(self, form_data)
            except ValidationException as e:
                if error is None:
                    error = ValidationException('Form Validation Failed')

                # ValidationExceptions should either be bound to something or be a list of other ValidationExceptions
                if e.bound:
                    error.add_error(e)
                else:
                    for form_level_error in e.nodes.values():
                        error.add_error(form_level_error)

        # If their is an error create a new form with all of the errors and
        # raise the ValidationException
        if error:
            # On error create new form and attach it to error.
            fields = [bound_field.field for bound_field in self.fields.values()]
            data = {}

            if self.data:
                data.update(data)

            data.update(form_data)

            form = Form(fields, data=data)
            form.errors = error
            error.bound = form
            raise error

        return r

    def __iter__(self):
        for field in self.fields.values():
            yield field

    def __getitem__(self, item):
        return self.fields[item]
