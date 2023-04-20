import useSignal from "./useSignal.js";

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

counter.current.onHandlerChangeValues = (values) => {
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

formValues.assignSignalValues.forEach((el) => {
  el.oninput = ({ target }) => {
    const dataset = target.dataset;
    if (Object.keys(dataset).includes("inputName")) {
      formValues.current.name = target.value.replace(/[0-9\s]/g, "");
    } else if (Object.keys(dataset).includes("inputAge")) {
      formValues.current.age = target.value.replace(/-\d+/g, 0);
    }
  };
});

formValues.current.onHandlerChangeValues = ({ name, age }) => {
  if (name.length > 2 && age >= 18) {
    disabledButton.current.disabled = false;
    disabledButton.current.message = "You may now submit :)";
  } else if (!disabledButton.current.disabled) {
    disabledButton.current.disabled = true;
    disabledButton.current.message = disabledButtonMessage;
  }
};

document.querySelector("#submitForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert(`Right now ${formValues.current.name} it feels like nothing is happening, 
  but I'm optimistic that things will pick up 
  soon.`);
});

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

document.querySelectorAll("button").forEach((btn) => {
  btn.onclick = (e) => {
    switch (e.target.dataset.type) {
      case "increment": {
        counter.current.number++;
        break;
      }

      case "decrement": {
        counter.current.number--;
        break;
      }

      case "reset": {
        counter.current.number = 0;
        break;
      }

      case "setTheInputWithRandomNumbers": {
        formValues.current.name = Math.random() * 46;
        break;
      }

      case "translateElement": {
        if (changeCertainValues.current.class === "translateElement") {
          changeCertainValues.current.class = "";
          break;
        }
        changeCertainValues.current.class = "translateElement";
        break;
      }
    }
  };
});
