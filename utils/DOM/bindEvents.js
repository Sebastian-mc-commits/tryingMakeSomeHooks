const bindEvent = ({
  datasets = [
    {
      dataset: "[data-onclick-type]",
      event: "click"
    }
  ]
}) => {
  const elements = document.querySelectorAll(
    datasets.map(({ dataset }) => dataset).join(", ")
  );

  const parseDatasets = datasets.map((dt) => {
    const splitDataset = dt.dataset.replace(/\[data-|\]/g, "").split("-");
    return {
      ...dt,
      dataset: splitDataset
        .map((word, index) =>
          index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("")
    };
  });

  const functions = Array.from(elements).map((el) => {
    const currentDatasetType = parseDatasets.find((p) =>
      Object.keys(el.dataset).includes(p.dataset)
    );

    const setFunctionName = el.dataset[currentDatasetType.dataset];
    const fn = (event) => {
      if (typeof bindEvent[setFunctionName] === "function" && event.isTrusted) {
        bindEvent[setFunctionName]({
          event,
          events: { ...bindEvent }
        });
      }
    };

    el.addEventListener(currentDatasetType.event, fn);

    return { [setFunctionName]: fn };
  });

  return functions;
  // return Object.assign({}, ...functions);
};

export default bindEvent;
