# NexWordCloud
A Word Cloud with Client Side Rendering and Dynamic Number of Words

Word cloud for React with Hover functionality.

The NexWordCloud uses [wordcloud2.js](https://github.com/timdream/wordcloud2.js) by Tim Dream as a base component.

**View the [demo](https://nex-word-cloud.vercel.app/)**

## Installation

    - Clone the Repo
    - npm install

# Options

- A query parameter 'input' can be passed in the url which contains the file name of the json file which is located in ./public folder.

- A query parameter 'thumbnail' can be passed in the url which can define if the thumbnail should be displayed or not.

- Cloud width and height can be edited in the json to suit your use case.

- A weight factor can also be edited in the json to increase/reduce the size of the words.

- Clicked word is highlighted by a simple rectangular box around the word.

- /upload page is added where you can upload a CSV using the template defined in "./public/Template.csv" to generate a JSON with default styling.

