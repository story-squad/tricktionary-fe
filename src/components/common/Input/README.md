# Input

The input component was designed to be a consistent way to display input fields in HTML forms. It displays label text, the input field, and an error message when one is available, and uses its own stylesheet to ensure consisten styling across apps.

## Properties

The `Input` component has the following properties:

- `name` - the HTML name property of the input
- `label` - the label text to display above the input
- `type` - the HTML input type to render

It also takes the `register` property, which can be destructured from the `useForm` hook from `react-hook-form`, as well as the `error` property, which also comes from the hook.

> `const { register, errors } = useForm();`

- `register` - a funciton that connects your input to the form state
- `errors` - an object containing all of a form's current errors
- `placeholder` - a string containing placeholder text
- `showPassword` - a function that toggles password view on and off

Optionally, you can pass in a `rules` object, which contains the validation rules of that input field:

- `rules` - validation rules are documented [here](https://react-hook-form.com/api/#registerRef) (external site)

### Common Validation Rules

```ts
/* This will put the field into an error state on submit if it's empty */
rules={{ required: 'This field cannot be empty!' }}

/* Set a min length on a field */
rules={{
  minLength: {
    value: 5, // Field has a min length of 5
    message: 'Field must be 5 characters long.' // Specific error message
  }
}}

/* Compound Validation */
rules={{ // Goes in order from first to last
  required: 'Field is required.', // First check
  min: { // Second check
    value: 10, // Set a minimum value for a number field
    message: 'Value cannot be below 10'
  },
  validate: value => { // Third check, custom validation
    if (value > 20) return 'Value must be 20 or less.'
    else return true;
  }
}}
```

## Error Handling

The component reads from the `react-hook-form` `errors` object, and checks if `errors[name]` is defined. If it is, then the input field is put into an error state.

In an error state, two things happen:

- A non-breaking error message shifts/fades into view below the component
- The input field's border turns from green to red

Once an input field is in an error state, it stays in an error state until it receives a valid input.

## Styling

The component is wrapped in a div with the class name `.form-input`, and gains a second class, `.error`, when the input field is in an error state.

It's not recommended to adjust the styling of the internal elements, however you can safely adjust layout of the `.form-input` div.

> Style properties like `width` and `margin` are safe to use on the container.
