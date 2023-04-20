
const onClickButton = (dataset = "[data-onclick-type]", eventListener = "click") => {
  document.querySelectorAll(dataset).forEach((btn) => {
    btn.addEventListener(eventListener, (e) => {
      const type = e.target.dataset.onclickType
      switch (type) {
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
}