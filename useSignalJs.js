const useSignalJs = (value) => {
  
  return {
    get current() {
      return value;
    },

    set current(newValue) {
      value = newValue;

      if (typeof this.onHandlerChangeValue === "function") {
        this.onHandlerChangeValue(newValue);
      }
    },

    onHandlerChangeValue: ""
  };
};

export default useSignalJs;
