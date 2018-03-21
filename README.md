[![Maintainability](https://api.codeclimate.com/v1/badges/03785efcd227a5955cd9/maintainability)](https://codeclimate.com/github/maximjs/project-lvl2-s161/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/03785efcd227a5955cd9/test_coverage)](https://codeclimate.com/github/maximjs/project-lvl2-s161/test_coverage)
[![Build Status](https://travis-ci.org/maximjs/project-lvl2-s161.svg?branch=master)](https://travis-ci.org/maximjs/project-lvl2-s161)

Установка:
```
$ npm install gendiff-maxjs
```

Запуск:
```
$ gendiff [options] <firstConfig> <secondConfig>
```
Options:  
* -V, --version, output the version number
* -h, --help, output usage information
* -f, --format [type], output format [nested, plain, json] (default is nested)

Использовались: npm, babel, eslint, тесты - jest.  
В рамках проекта было необходимо реализовать cli утилиту для поиска отличий в конфигурационных файлах. Форматы данных: json, yaml, ini.

Пример использования:
```
first-config.json:
{
  "common": {
    "setting1": "Value 1",
    "setting2": "200",
    "setting3": true,
    "setting6": {
      "key": "value"
    }
  },
  "group1": {
    "baz": "bas",
    "foo": "bar"
  },
  "group2": {
    "abc": "12345"
  }
}

second-config.json:
{
  "common": {
    "setting1": "Value 1",
    "setting3": true,
    "setting4": "blah blah",
    "setting5": {
      "key5": "value5"
    }
  },

  "group1": {
    "foo": "bar",
    "baz": "bars"
  },

  "group3": {
    "fee": "100500"
  }
}

$ gendiff first-config.json second-config.json
{
    common: {
        setting1: Value 1
      - setting2: 200
        setting3: true
      - setting6: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      + baz: bars
      - baz: bas
        foo: bar
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}
```
