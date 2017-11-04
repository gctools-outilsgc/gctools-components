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

from setuptools import setup, find_packages

from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with open(path.join(here, 'README'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='pot-builder',
    version='0.1.0',

    description='A .pot file builder',
    long_description=long_description,

    # Author details
    author='Luc Belliveau',
    author_email='luc.belliveau@nrc-cnrc.gc.ca',

    # Choose your license
    license='MIT',

    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Topic :: Software Development :: Build Tools',

        'License :: OSI Approved :: MIT',

        'Programming Language :: Python :: 3',
    ],

    # What does your project relate to?
    keywords='gettext po pot',

    py_modules=["build"],

    install_requires=['babel'],


    # To provide executable scripts, use entry points in preference to the
    # "scripts" keyword. Entry points provide cross-platform support and allow
    # pip to create the appropriate form of executable for the target platform.
    entry_points={
        'console_scripts': [
            'po-build=build:main',
        ],
    },
)