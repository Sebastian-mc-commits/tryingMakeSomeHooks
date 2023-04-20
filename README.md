#Trying to make some hooks of react

* useSignal
* when the value changes, the html labels who shares the value changes as well 
* (at the moment only works with textContent and value of input).

*syntax
Html
*<p data-"variableName"></p>
js
*variableName = useSignal("initialValue", "dataVariable")

*UseSignal returns: current (The current value that if changes, the "p" of html changes),
assignSignalValues (All the dom tags who shares the useSignal variable), onHandlerChangeValues 
(When the value changes is reflected in js).

*is worth nothing that the "onHandlerChangeValues" for useSignal starting with an object its call is: "variableName".current.onHandlerChangeValues

*Examples

const counter = useSignal(
  {
    number: 0,
    title: "Counter"
  },
  "counter"
);

counter.current.number++;

counter.current.onHandlerChangeValues = (values = ("current values")) => {
  if (values.number === 100) {
    counter.current.number = 0
    "when is 100 do something"
  }
};

const disabledButtonMessage = `Fill properly The 
Following fields to active this 
button`;

const disabledButton = useSignal(disabledButtonMessage, "disabled");

disabledButton.onHandlerChangeValues = () => "do something every the disabledButton changes its value"