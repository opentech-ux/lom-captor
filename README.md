# OpenTech UX LOM Captor

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fopentech-ux%2Flom-captor%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/opentech-ux/lom-captor/goto?ref=master)

- [OpenTech UX LOM Captor](#opentech-ux-lom-captor)
  * [Description](#description)
  * [Installation](#installation)
  * [Configuration](#configuration)
      - [Endpoint](#endpoint)
      - [Custom attribute](#custom-attribute)
  * [Launching](#launching)
  * [License](#license)

## Description

Script that allows to obtain information about the visited sites to recreate a session behavior with
the compiler.

This script is made to obtain the browsing information of a user within a web site. By storing
information in the browser's local storage it is possible to keep track of a person's movement on a
web page.

By obtaining and storing the information in the format of this
[JSON schema](https://opentech-ux.github.io/lom-format/) it is possible to perform a simulation of a
user's navigation through our [compiler](https://github.com/opentech-ux/lom-compiler).

## Installation

To start with this section, you will need to have access to the JavaScript file of the library. We
recommend downloading the latest version from the releases section. However, you could reference
this file via the following link :

`https://opentech-ux.github.io/lom-captor/dist/opentech-ux-1.0.0.js`

We try to keep the script installation as simple as possible. Mainly you will need to add a script
tag that references the script's JavaScript file in the head of the HTML file. Like this:

```html
<!DOCTYPE html>
<html>
   <head>
      ...
      <script src="opentech-ux-lib.js" />
      ...
   </head>
   <body>
      ...
   </body>
</html>
```

## Configuration

Despite having installed the script as specified in the previous steps, it will not be executed
because it needs a minimum configuration to start its operation.

Currently the script accepts the following attributes:

|       Name       |   Attribute in tag    | Attribute in argument object | Necessary |  Type  | Default value |                                                                Description                                                                |
| :--------------: | :-------------------: | :--------------------------: | :-------: | :----: | :-----------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|     Endpoint     |     data-endpoint     |           endpoint           |    YES    | String |  `undefined`  |                                      Defines the URL destination for the script session information.                                      |
| Custom attribute | data-custom-attribute |       customAttribute        |    NO     | String |  `undefined`  | Defines the name of the key where to enclose the session information. This key will be part of the body JSON sent to the defined endpoint |

-  #### Endpoint

   This URL string will define where the script sends the session information to be stored. The
   script makes POST requests to the endpoint with the session information as the request body. The
   storage system where the information will be store should accept JSON bodies in the incoming
   requests.

   E.G.:

   ```html
   <script src="opentech-ux-lib.js" data-endpoint="https://storage.systemforthe.data" />
   ```

-  #### Custom attribute

   This parameter will define the name of the key where to enclose the session information at the
   moment of sending it to the defined endpoint. This is to add some customization in the case of
   your storage system cannot accept or get information from the body root.

   -  If not defined, the request body will see like this:

   ```JSON
   {
    "loms": {
        "page": {
            "bounds": {
                "height": 6266.75,
                "width": 1905,
                "x": 0,
                "y": 0
            },
           ...
        },
        ...
    },
    "pageHeight": 6267,
    ...
   }
   ```

   -  If defined with some name such as "information", the request body will see like this:

   ```html
   <script
      src="opentech-ux-lib.js"
      data-endpoint="https://storage.systemforthe.data"
      data-custom-attribute="information"
   />
   ```

   ```json
   {
    "information": {
        "loms": {
            "page": {
                "bounds": {
                    "height": 6266.75,
                    "width": 1905,
                    "x": 0,
                    "y": 0
                },
                ...
            },
            ...
        },
        "pageHeight": 6267,
        ...
    }
   }
   ```

## Launching

One of the reasons why we recommend adding the script tag in the header of the HTML file is to take
advantage of the `onreadystatechange` event. This allows us to execute the script automatically when
the page has completed loading.

However, we know that it is not always possible due to possible conflicts with external libraries or
for the simple fact of not wanting to execute the process automatically. For this reason, a global
variable of the library is available.

This variable is accessible from the `window` object and gets the `start` method, which accepts as
parameter a JSON object with the same configuration accepted by the script tag. The variables in the
argument object have the same characteristics as defined in the table before.

E.G.:

```html
<script src="opentech-ux-lib.js"></script>
<script type="text/javascript">
   window.OpentechUX.start({
      endpoint: 'https://storage.systemforthe.data',
   });
</script>

OR

<script type="text/javascript">
   window.OpentechUX.start({
      endpoint: 'https://storage.systemforthe.data',
      customAttribute: 'information',
   });
</script>
```

<small>The code above is at the end of the body tag, this will execute the script right after
getting the JavaScript file. Depending of when you want to execute the script and the technology
used in the page you shout call this method in the right place.</small>

## License

[APACHE 2.0](LICENSE)
