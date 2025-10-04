

const frontend = {

  storageAvailable: (type) => {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }

  , setToLocalStorage: (key, value) => {
    console.log("[setToLocalStorage|in] (%o,%o)", key, value)
    let result = null
    if (storageAvailable("localStorage")){
      localStorage.setItem(key, value)
      result = value
    }
    console.log("[setToLocalStorage|out] => %o", result)
    return result
  }

  , getFromLocalStorage: (key) => {
    console.log("[getFromLocalStorage|in] (%o)", key)
    let result = null
    if (storageAvailable("localStorage")){
      result = localStorage.getItem(key)
    }
    console.log("[getFromLocalStorage|out] => %o", result)
    return result
  }

  , unsetFromLocalStorage: (key) => {
    console.log("[unsetFromLocalStorage|in] (%o)", key)
    let result = null
    if (storageAvailable("localStorage")){
      result = localStorage.removeItem(key)
    }
    console.log("[unsetFromLocalStorage|out] => %o", result)
    return result
  }

}

module.exports = frontend;
