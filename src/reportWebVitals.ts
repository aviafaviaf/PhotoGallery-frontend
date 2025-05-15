type ReportHandler = (metric: {
  name: string;
  value: number;
  delta: number;
  id: string;
}) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((WebVitals) => {
      const {
        getCLS,
        getFID,
        getFCP,
        getLCP,
        getTTFB,
      } = (WebVitals as any).default ?? WebVitals;

      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;