export const setSignalValues = ({ dataValue, isObj = false, value }) => {
  let attributes = `[data-${dataValue}]`;
  if (isObj) {
    attributes = Object.keys(value)
      .map((value) => `[data-${dataValue}-${value}]`)
      .join(", ");
  }
  const elements = document.querySelectorAll(attributes);
  elements.forEach((el) => {
    let setValue = value;
    if (isObj) {
      for (let key in value) {
        const datasetKey =
          key.length === 1
            ? key.toUpperCase()
            : key.charAt(0).toUpperCase() + key.slice(1);

        if (typeof el.dataset[`${dataValue}${datasetKey}`] !== "undefined") {
          setValue = value[key];
          break;
        }
      }
    }
    if (el.tagName === "INPUT") {
      return (el.value = setValue);
    }

    return (el.textContent = setValue);
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

          if (
            obj?.onHandlerChangeValues &&
            typeof obj?.onHandlerChangeValues === "function"
          ) {
            obj.onHandlerChangeValues(current);
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
