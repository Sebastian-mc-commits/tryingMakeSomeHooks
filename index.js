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

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
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
        console.log(formValues.current.name);
      }
    }
  });
});

counter.current.onHandlerChangeValues = (values) => {
  if (values.number === 100) {
    alert( "I'm afraid I can't let you exceed the 100 number, but thanks for chill :)")
    counter.current.number = 0

    counter.current.title = "Sorry fella :("
    setTimeout(() => {
      counter.current.title = "Counter"
    }, 2000)
  }
};


const disabledButtonMessage = `Fill properly The 
Following fields to active this 
button`;

const disabledButton = useSignal(disabledButtonMessage, "disabled");

formValues.assignSignalValues.forEach((el) => {
  el.addEventListener("input", ({ target }) => {
    const dataset = target.dataset;
    if (Object.keys(dataset).includes("inputName")) {
      formValues.current.name = target.value.replace(/[0-9\s]/g, "");
    } else if (Object.keys(dataset).includes("inputAge")) {
      formValues.current.age = target.value.replace(/-\d+/g, 0);
    }
  });
});

formValues.current.onHandlerChangeValues = ({ name, age }) => {
  console.log("Change");

  if (name.length > 2 && age >= 18) {
    disabledButton.assignSignalValues.forEach((btn) => (btn.disabled = false));
    return disabledButton.current = "You may now submit :)";
  }

  disabledButton.assignSignalValues.forEach(btn => {
    if (!btn.disabled) {
      btn.disabled = true
    }
  })

  disabledButton.current = disabledButtonMessage
};

document.querySelector("#submitForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert(`Right now ${formValues.current.name} it feels like nothing is happening, 
  but I'm optimistic that things will pick up 
  soon.`)
})
