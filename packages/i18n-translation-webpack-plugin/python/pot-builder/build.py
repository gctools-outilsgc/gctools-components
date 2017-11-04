#!/usr/bin/env python
"""
/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
"""

"""
Python module that creates or updates .po files based on the specified .pot
file found in the localization_path.  It is designed to be invoked via node.
"""

from os import walk
import os.path
import json
import sys

from babel.messages.frontend import init_catalog
from babel.messages.frontend import update_catalog


def main():
    """
    Convert .pot files into .po files based on the configuration provided
    """
    if len(sys.argv) < 2:
        print("Invalid syntax")
        sys.exit(1)

    config = json.loads(sys.argv[1])
    if 'path' not in config or 'languages' not in config or 'filename' not in config:
        print("Invalid syntax")
        sys.exit()

    localization_path = config['path']
    filename = config['filename']
    languages = config['languages']

    use_file = os.path.join(localization_path, 'templates', filename)

    if not os.path.isfile(use_file):
      return "Error: file not found."

    for lang in languages:
      if os.path.isfile("%s/%s/LC_MESSAGES/%s.po" % (
              localization_path, lang, filename[:-4])):
          print("Updating catalog %s/%s.po." % (lang, filename[:-4]))
          method = update_catalog()
      else:
          print("Initializing catalog %s/%s.po." % (lang, filename[:-4]))
          method = init_catalog()

      method.initialize_options()
      method.input_file = use_file
      method.domain = filename[:-4]
      method.output_dir = localization_path
      method.locale = lang
      method.finalize_options()
      method.run()


if __name__ == '__main__':
    main()
