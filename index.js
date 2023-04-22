import useSignal from "./useSignal.js";
import bindEvent from "./utils/DOM/bindEvents.js";

const handleEvent = {};
const counter = useSignal(
  {
    number: 0,
    title: "Counter"
  },
  "counter"
);

const formValues = useSignal(
  {
    name: "",
    age: 0
  },
  "input"
);

counter.onHandlerChangeValues = (values) => {
  if (values.number === 100) {
    alert(
      "I'm afraid I can't let you exceed the 100 number, but thanks for chill :)"
    );
    counter.current.number = 0;

    counter.current.title = "Sorry fella :(";
    setTimeout(() => {
      counter.current.title = "Counter";
    }, 2000);
  }
};

const disabledButtonMessage = `Fill properly The 
Following fields to active this 
button`;

const disabledButton = useSignal(
  {
    message: disabledButtonMessage,
    disabled: true
  },
  "disabled_button"
);

formValues.onHandlerChangeValues = ({ name, age }) => {
  if (name.length > 2 && age >= 18) {
    disabledButton.current.disabled = false;
    disabledButton.current.message = "You may now submit :)";
  } else if (!disabledButton.current.disabled) {
    disabledButton.current.disabled = true;
    disabledButton.current.message = disabledButtonMessage;
  }
};

const changeCertainValues = useSignal(
  {
    placeholder: "Waiting...",
    val: "",
    change_placeholder: "Hello fella",
    class: ""
  },
  "animate"
);

const handleOnChangeInput = ({ target }) => {
  const currentValue = target.dataset;
  const value = target.value.replace(/(sebas+)/g, " :) ");
  if ("animateVal" in currentValue) {
    changeCertainValues.current.val = value;
  } else if ("animateChange_placeholder" in currentValue) {
    changeCertainValues.current.change_placeholder = value;
    changeCertainValues.current.placeholder = value;
  }
};

changeCertainValues.assignSignalValues.forEach((el) => {
  el.oninput = handleOnChangeInput;
});

changeCertainValues.onHandlerChangeValues = (obj, { key, valueChanged }) => {};

handleEvent.increment = () => counter.current.number++;

handleEvent.decrement = () => counter.current.number--;

handleEvent.reset = () => (counter.current.number = 0);

handleEvent.setTheInputWithRandomNumbers = () => {
  formValues.current.name = Math.random() * 46;
};

handleEvent.translateElement = ({events}) => {
  events.increment()
  if (changeCertainValues.current.class === "translateElement") {
    changeCertainValues.current.class = "";
    return;
  }
  changeCertainValues.current.class = "translateElement";
};

handleEvent.logTheNestedObject = () => {
  changeCertainValues.current.val = {
    classList: {
      toggle: "translateElement"
    }
  };
};

handleEvent.handleAge = ({event}) => {
  formValues.current.age = event.target.value.replace(/-\d+/g, 0);
}

handleEvent.handleName = ({event}) => {
  formValues.current.name = event.target.value.replace(/[0-9\s]/g, "");
}

handleEvent.submitForm = ({event}) => {
  event.preventDefault()
  alert(`Right now ${formValues.current.name} it feels like nothing is happening, 
  but I'm optimistic that things will pick up 
  soon.`);
}

const bindEventConfig = {
  datasets: [
    {
      dataset: "[data-onclick-type]",
      event: "click"
    },

    {
      dataset: "[data-oninput_change-type]",
      event: "input"
    },

    {
      dataset: "[data-onsubmit-type]",
      event: "submit"
    }
  ]
}


bindEvent(bindEventConfig);

Object.assign(bindEvent, handleEvent);
