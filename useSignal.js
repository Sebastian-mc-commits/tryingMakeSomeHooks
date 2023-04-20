import DOM_ENUM from "./const/DOM.enum.js";

const assignValue = (element, value) => {
  if (element.tagName === "INPUT") {
    element.value = value;
  } else element.textContent = value;
};

export const setValues = ({ elements, value, dataValue, isObj }) => {
  elements.forEach((el) => {
    if (isObj) {
      for (let key in value) {
        const datasetKey =
          key.length === 1
            ? key.toUpperCase()
            : key.charAt(0).toUpperCase() + key.slice(1);

        const condition =
          typeof el.dataset[`${dataValue}${datasetKey}`] !== "undefined";
        if (condition && Object.keys(DOM_ENUM).includes(key)) {
          el[DOM_ENUM[key]] = value[key];
        } else if (condition) {
          assignValue(el, value[key]);
        }
      }
      return
    }

    assignValue(el, value);
  });
};

export const setSignalValues = ({ dataValue, isObj = false, value }) => {
  let attributes = `[data-${dataValue}]`;
  if (isObj) {
    attributes = Object.keys(value)
      .map((value) => `[data-${dataValue}-${value}]`)
      .join(", ");
  }
  const elements = document.querySelectorAll(attributes);

  setValues({
    elements,
    dataValue,
    value,
    isObj
  });
  return elements;
};

const useSignal = (signal, signalName) => {
  let current = signal;

  if (typeof signal === "object") {
    const assignSignalValues = setSignalValues({
      dataValue: signalName,
      isObj: true,
      value: signal
    });

    return {
      current: new Proxy(signal, {
        get: (target, key) => {
          if (!key) {
            return target;
          }
          return target[key];
        },

        set: (target, key, value, obj) => {
          target[key] = value;
          setSignalValues({
            dataValue: signalName,
            isObj: true,
            value: obj
          });

          const condition =
            obj?.onHandlerChangeValues &&
            typeof obj?.onHandlerChangeValues === "function";

          if (condition) {
            obj.onHandlerChangeValues(current, {
              keyChanged: key,
              valueChanged: value
            });
          }

          return true;
        }
      }),

      assignSignalValues
    };
  }

  const assignSignalValues = setSignalValues({
    dataValue: signalName,
    value: signal
  });
  return {
    get current() {
      return current;
    },

    set current(newValue) {
      setSignalValues({
        dataValue: signalName,
        value: newValue
      });

      current = newValue;
      if (
        this.onHandlerChangeValues &&
        typeof this.onHandlerChangeValues === "function"
      ) {
        this.onHandlerChangeValues(current);
      }
    },

    onHandlerChangeValues: "",

    assignSignalValues
  };
};

export default useSignal;
