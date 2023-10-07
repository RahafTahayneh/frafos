const types = [
  "call-attempt",
  "conf-join",
  "call-end",
  "auth-failed",
  "reg-del",
  "error",
  "reg-new",
  "alert",
  "call-start",
  "conf-leave",
];

const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
const thirtyMinutes = 30 * 60 * 1000;

let buckets = [];

for (let i = 0; i < 48; i++) {
  const currentTime = new Date(oneDayAgo.getTime() + i * thirtyMinutes);
  const formattedTime = currentTime.toISOString();

  const typeData = types
    .map((type) => {
      // Occasionally set the count to 0 to simulate real-world gaps in the data
      const doc_count =
        Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 10);
      return {
        key: type,
        doc_count,
      };
    })
    .filter((t) => t.doc_count !== 0); // Remove types with 0 count to reflect in the dummy data

  buckets.push({
    key_as_string: formattedTime,
    key: currentTime.getTime(),
    doc_count: typeData.reduce((sum, t) => sum + t.doc_count, 0),
    agg: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: typeData,
    },
  });
}

const dummyData = {
  aggregations: {
    agg: {
      buckets,
    },
  },
};

console.log(JSON.stringify(dummyData, null, 2));
export {};
