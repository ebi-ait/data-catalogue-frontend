# Theming
We are using vanilla css modules and variables for theming. The `src/theme/theme.css` file contains the global variables 
that are used across the project to control its colors and fonts. `::root` element contains global variables and variables 
specific to certain tags can be defined separately. These variables can be accessed by the DOM so possible to change 
in Javascript code if necessary.

## Usage

```
// theme.css
:root {
    --color-main: #15a2e7;
}

//Grid.module.css
@import './theme.css';

.submitButton {
    color: var(--color-main);
}
```
