from django.conf import settings
import logging


def d_log(message: str = "No message provided.", toggle: bool = settings.PROJECT_LOGGING_FLAG):
  """
  Provides a simple way to print debug messages to the console.

  Args:
    message (str): Message to be printed on the log, has a default if not provided.
    toggle (bool): Reads the PROJECT_LOGGING_FLAG in `settings.py`.
  """
  if not toggle:
    pass
  else:
    logger = logging.getLogger("api")
    logger.debug(f"{message}")