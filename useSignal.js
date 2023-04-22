import DOM_ENUM from "./const/DOM.enum.js";
import { delimiter } from "./utils/const/staticVars.js";

const assignValue = (element, value) => {
  if (element.tagName === "INPUT") {
    element.value = value;
  } else element.textContent = value;
};

export const checkNestedObject = ({ obj, parentKey = null }, fn) => {
  let newKey;
  for (let [key, value] of Object.entries(obj)) {
    newKey = parentKey ? `${parentKey}${delimiter}${key}` : key;

    if (typeof value === "object") {
      checkNestedObject(
        {
          obj: value,
          parentKey: newKey
        },
        fn
      );
    } else {
      fn({ newKey: newKey.split(delimiter), value });
    }
  }
};

const retrieveParseObjectValues = (el, { newKey, value: nestedValue }) => {
  let element = el;
  for (let i = 0; i < newKey.length - 1; i++) {
    element = element[newKey[i]];
  }

  const type = typeof element[newKey[newKey.length - 1]];

  if (type === "function") {
    element[newKey[newKey.length - 1]](nestedValue);
  } else {
    element[newKey[newKey.length - 1]] = nestedValue;
  }
};
export const setValues = ({ elements, value, dataValue }) => {
  elements.forEach((el) => {
    for (let key in value) {
      const datasetKey =
        key.length === 1
          ? key.toUpperCase()
          : key.charAt(0).toUpperCase() + key.slice(1);

      const condition =
        typeof el.dataset[`${dataValue}${datasetKey}`] !== "undefined";

      if (typeof value[key] === "object" && condition) {
        checkNestedObject(
          {
            obj: value[key]
          },
          (data) => retrieveParseObjectValues(el, data)
        );
      } else if (condition && Object.keys(DOM_ENUM).includes(key)) {
        el[DOM_ENUM[key]] = value[key];
      } else if (condition) {
        assignValue(el, value[key]);
      }
    }
  });
};

export const setSignalValues = ({ dataValue, value }) => {
  const attributes = Object.keys(value)
    .map((value) => `[data-${dataValue}-${value}]`)
    .join(", ");
  const elements = document.querySelectorAll(attributes);

  setValues({
    elements,
    dataValue,
    value
  });
  return elements;
};

const useSignal = (signal, signalName) => {
  let current = signal;

  const assignSignalValues = setSignalValues({
    dataValue: signalName,
    value: signal
  });

  const useSignalFunction = {
    current: new Proxy(signal, {
      get: (target, key) => {
        if (!key) {
          return target;
        }
        return target[key];
      },

      set: (target, key, value, obj) => {
        let ignoreCallOfFunction = false;
        if (key[0] === "_") {
          ignoreCallOfFunction = true;
          key = key.slice(1);
        }
        target[key] = value;

        const condition =
          typeof useSignalFunction?.onHandlerChangeValues === "function";

        if (condition && !ignoreCallOfFunction) {
          useSignalFunction.onHandlerChangeValues(current, {
            key: key,
            valueChanged: value
          });
        }

        setSignalValues({
          dataValue: signalName,
          value: obj
        });

        return true;
      }
    }),

    onHandlerChangeValues: "",

    get assignSignalValues() {
      return assignSignalValues;
    }
  };

  return useSignalFunction;
};

export default useSignal;
