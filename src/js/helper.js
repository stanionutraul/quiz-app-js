import { TIMEOT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, rejected) {
    setTimeout(function () {
      rejected(new Error(`Request took to long!Timeot after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          header: {
            "Content-type": "application/json",
          },
          bodu: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
