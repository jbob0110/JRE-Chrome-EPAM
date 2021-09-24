var productOwners = [];
var EPAMproductOwners = [];
var testAnalysts = [];
var EPAMtestAnalysts = [];
var softwareEngineers = [];
var EPAMsoftwareEngineers = [];

var isFirefox = typeof InstallTrigger !== 'undefined';
window.onload = () => {
  chrome.storage.sync.get(['POarray'], function (result) {
    if (result.POarray === undefined) {
      chrome.storage.sync.set({ POarray: productOwners }, function () { console.log("Initial product owner array save!"); });
    }
  });
  chrome.storage.sync.get(['EPOarray'], function (result) {
    if (result.EPOarray === undefined) {
      chrome.storage.sync.set({ EPOarray: EPAMproductOwners }, function () { console.log("Initial EPAM BA array save!"); });
    }
  });
  chrome.storage.sync.get(['TAarray'], function (result) {
    if (result.TAarray === undefined) {
      chrome.storage.sync.set({ TAarray: testAnalysts }, function () { console.log("Initial test analyst array save!"); });
    }
  });
  chrome.storage.sync.get(['ETAarray'], function (result) {
    if (result.ETAarray === undefined) {
      chrome.storage.sync.set({ ETAarray: EPAMtestAnalysts }, function () { console.log("Initial EPAM AQA array save!"); });
    }
  });
  chrome.storage.sync.get(['SEarray'], function (result) {
    if (result.SEarray === undefined) {
      chrome.storage.sync.set({ SEarray: softwareEngineers }, function () { console.log("Initial software engineer array save!"); });
    }
  });
  chrome.storage.sync.get(['ESEarray'], function (result) {
    if (result.ESEarray === undefined) {
      chrome.storage.sync.set({ ESEarray: EPAMsoftwareEngineers }, function () { console.log("Initial EPAM software engineer array save!"); });
    }
  });

  addPOs();
  addEPOs();
  addTAs();
  addETAs();
  addSEs();
  addESEs();
  document.getElementById('addPO').onclick = () => {
    var name = document.getElementById("POname").value;
    var id = document.getElementById("POid").value;
    chrome.storage.sync.get(['POarray'], function (result) {
      for (var i = 0; i < result.POarray.length; i++) {
        holder = result.POarray[i].split(" :");
        productOwners[holder[0]] = true;
      }
      if (productOwners[name] != undefined) {
        alert("Person is already on the list.");
        document.getElementById('POname').value = '';
        document.getElementById('POid').value = '';
      } else {
        productOwners[name] = true;
        addNames('POname', 'POid', 'POlist', document.getElementById('POname').value + " :" + document.getElementById('POid').value, productOwners, deletePO);
      }
    });
  }
  document.getElementById('addEPO').onclick = () => {
    var name = document.getElementById("EPOname").value;
    var id = document.getElementById("EPOid").value;
    chrome.storage.sync.get(['EPOarray'], function (result) {
      for (var i = 0; i < result.EPOarray.length; i++) {
        holder = result.EPOarray[i].split(" :");
        EPAMproductOwners[holder[0]] = true;
      }
      if (EPAMproductOwners[name] != undefined) {
        alert("Person is already on the list.");
        document.getElementById('EPOname').value = '';
        document.getElementById('EPOid').value = '';
      } else {
        EPAMproductOwners[name] = true;
        addNames('EPOname', 'EPOid', 'EPOlist', document.getElementById('EPOname').value + " :" + document.getElementById('EPOid').value, EPAMproductOwners, deleteEPO);
      }
    });
  }
  document.getElementById('addTA').onclick = () => {
    var name = document.getElementById("TAname").value;
    chrome.storage.sync.get(['TAarray'], function (result) {
      for (var i = 0; i < result.TAarray.length; i++) {
        holder = result.TAarray[i].split(" :");
        testAnalysts[holder[0]] = true;
      }
      if (testAnalysts[name] != undefined) {
        alert("Name already on the list.");
        document.getElementById('TAname').value = '';
        document.getElementById('TAid').value = '';
      } else {
        testAnalysts[name] = true;
        addNames('TAname', 'TAid', 'TAlist', document.getElementById('TAname').value + " :" + document.getElementById('TAid').value, testAnalysts, deleteTA);
      }
    });
  }
  document.getElementById('addETA').onclick = () => {
    var name = document.getElementById("ETAname").value;
    chrome.storage.sync.get(['ETAarray'], function (result) {
      for (var i = 0; i < result.ETAarray.length; i++) {
        holder = result.ETAarray[i].split(" :");
        EPAMtestAnalysts[holder[0]] = true;
      }
      if (EPAMtestAnalysts[name] != undefined) {
        alert("Name already on the list.");
        document.getElementById('ETAname').value = '';
        document.getElementById('ETAid').value = '';
      } else {
        EPAMtestAnalysts[name] = true;
        addNames('ETAname', 'ETAid', 'ETAlist', document.getElementById('ETAname').value + " :" + document.getElementById('ETAid').value, EPAMtestAnalysts, deleteETA);
      }
    });
  }
  document.getElementById('addSE').onclick = () => {
    var name = document.getElementById("SEname").value;
    chrome.storage.sync.get(['SEarray'], function (result) {
      for (var i = 0; i < result.SEarray.length; i++) {
        holder = result.SEarray[i].split(" :");
        softwareEngineers[holder[0]] = true;
      }
      if (softwareEngineers[name] != undefined) {
        alert("Name already on the list.");
        document.getElementById('SEname').value = '';
        document.getElementById('SEid').value = '';
      } else {
        softwareEngineers[name] = true;
        addNames('SEname', 'SEid', 'SElist', document.getElementById('SEname').value + " :" + document.getElementById('SEid').value, softwareEngineers, deleteSE);
      }
    });
  }
  document.getElementById('addESE').onclick = () => {
    var name = document.getElementById("ESEname").value;
    chrome.storage.sync.get(['ESEarray'], function (result) {
      for (var i = 0; i < result.ESEarray.length; i++) {
        holder = result.ESEarray[i].split(" :");
        EPAMsoftwareEngineers[holder[0]] = true;
      }
      if (EPAMsoftwareEngineers[name] != undefined) {
        alert("Name already on the list.");
        document.getElementById('ESEname').value = '';
        document.getElementById('ESEid').value = '';
      } else {
        EPAMsoftwareEngineers[name] = true;
        addNames('ESEname', 'ESEid', 'ESElist', document.getElementById('ESEname').value + " :" + document.getElementById('ESEid').value, EPAMsoftwareEngineers, deleteESE);
      }
    });
  }
}
function save_options() {
  if (isFirefox) {
    browser.storage.sync.set({
      POarray: productOwners,
      EPOarray: EPAMproductOwners,
      TAarray: testAnalysts,
      ETAarray: EPAMtestAnalysts,
      SEarray: softwareEngineers,
      ESEarray: EPAMsoftwareEngineers
    }, function () {
      console.log("Settings Saved")
    });
  } else {
    chrome.storage.sync.set({
      POarray: productOwners,
      EPOarray: EPAMproductOwners,
      TAarray: testAnalysts,
      ETAarray: EPAMtestAnalysts,
      SEarray: softwareEngineers,
      ESEarray: EPAMsoftwareEngineers
    }, function () {
      console.log("Settings Saved");
    });
  }
}
function deletePO(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < productOwners.length; i++) {
    if (!isFirefox) {
      if (productOwners[i] === e.path[1].innerHTML) {
        var holder = productOwners[i].split(" :");
        productOwners[holder[0]] = undefined;
        productOwners.splice(i, 1);
        break;
      }
    } else {
      if (productOwners[i] === e.originalTarget.parentElement.innerHTML) {
        var holder = productOwners[i].split(" :");
        productOwners[holder[0]] = undefined;
        productOwners.splice(i, 1);
        break;
      }
    }
  }
  if (!isFirefox) {
    e.path[1].style.display = "none";
  } else {
    e.originalTarget.parentElement.style.display = "none";
  }
  save_options();
}
function deleteEPO(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < EPAMproductOwners.length; i++) {
    if (!isFirefox) {
      if (EPAMproductOwners[i] === e.path[1].innerHTML) {
        var holder = EPAMproductOwners[i].split(" :");
        EPAMproductOwners[holder[0]] = undefined;
        EPAMproductOwners.splice(i, 1);
        break;
      }
    } else {
      if (EPAMproductOwners[i] === e.originalTarget.parentElement.innerHTML) {
        var holder = EPAMproductOwners[i].split(" :");
        EPAMproductOwners[holder[0]] = undefined;
        EPAMproductOwners.splice(i, 1);
        break;
      }
    }
  }
  if (!isFirefox) {
    e.path[1].style.display = "none";
  } else {
    e.originalTarget.parentElement.style.display = "none";
  }
  save_options();
}
function deleteTA(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < testAnalysts.length; i++) {
    if (!isFirefox) {
      if (testAnalysts[i] === e.path[1].innerHTML) {
        var holder = testAnalysts[i].split(" :");
        testAnalysts[holder[0]] = undefined;
        testAnalysts.splice(i, 1);
        break;
      }
    } else {
      if (testAnalysts[i] === e.originalTarget.parentElement.innerHTML) {
        var holder = testAnalysts[i].split(" :");
        testAnalysts[holder[0]] = undefined;
        testAnalysts.splice(i, 1);
        break;
      }
    }
  }
  if (!isFirefox) {
    e.path[1].style.display = "none";
  } else {
    e.originalTarget.parentElement.style.display = "none";
  }
  save_options();
}
function deleteETA(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < EPAMtestAnalysts.length; i++) {
    if (!isFirefox) {
      if (EPAMtestAnalysts[i] === e.path[1].innerHTML) {
        var holder = EPAMtestAnalysts[i].split(" :");
        EPAMtestAnalysts[holder[0]] = undefined;
        EPAMtestAnalysts.splice(i, 1);
        break;
      }
    } else {
      if (EPAMtestAnalysts[i] === e.originalTarget.parentElement.innerHTML) {
        var holder = EPAMtestAnalysts[i].split(" :");
        EPAMtestAnalysts[holder[0]] = undefined;
        EPAMtestAnalysts.splice(i, 1);
        break;
      }
    }
  }
  if (!isFirefox) {
    e.path[1].style.display = "none";
  } else {
    e.originalTarget.parentElement.style.display = "none";
  }
  save_options();
}
function deleteSE(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < softwareEngineers.length; i++) {
    if (!isFirefox) {
      if (softwareEngineers[i] === e.path[1].innerHTML) {
        var holder = softwareEngineers[i].split(" :");
        softwareEngineers[holder[0]] = undefined;
        softwareEngineers.splice(i, 1);
        break;
      }
    } else {
      if (softwareEngineers[i] === e.originalTarget.parentElement.innerHTML) {
        var holder = softwareEngineers[i].split(" :");
        softwareEngineers[holder[0]] = undefined;
        softwareEngineers.splice(i, 1);
        break;
      }
    }
  }
  if (!isFirefox) {
    e.path[1].style.display = "none";
  } else {
    e.originalTarget.parentElement.style.display = "none";
  }
  save_options();
}
function deleteESE(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < EPAMsoftwareEngineers.length; i++) {
    if (!isFirefox) {
      if (EPAMsoftwareEngineers[i] === e.path[1].innerHTML) {
        var holder = EPAMsoftwareEngineers[i].split(" :");
        EPAMsoftwareEngineers[holder[0]] = undefined;
        EPAMsoftwareEngineers.splice(i, 1);
        break;
      }
    } else {
      if (EPAMsoftwareEngineers[i] === e.originalTarget.parentElement.innerHTML) {
        var holder = EPAMsoftwareEngineers[i].split(" :");
        EPAMsoftwareEngineers[holder[0]] = undefined;
        EPAMsoftwareEngineers.splice(i, 1);
        break;
      }
    }
  }
  if (!isFirefox) {
    e.path[1].style.display = "none";
  } else {
    e.originalTarget.parentElement.style.display = "none";
  }
  save_options();
}
function addPOs() {
  chrome.storage.sync.get(['POarray'], function (result) {
    for (var i = 0; i < result.POarray.length; i++) {
      result.POarray[i] = result.POarray[i].split("<sp")[0];
      addNames('POname', 'POid', 'POlist', result.POarray[i], productOwners, deletePO);
    }
  });
}
function addEPOs() {
  chrome.storage.sync.get(['EPOarray'], function (result) {
    for (var i = 0; i < result.EPOarray.length; i++) {
      result.EPOarray[i] = result.EPOarray[i].split("<sp")[0];
      addNames('EPOname', 'EPOid', 'EPOlist', result.EPOarray[i], EPAMproductOwners, deleteEPO);
    }
  });
}
function addTAs() {
  chrome.storage.sync.get(['TAarray'], function (result) {
    for (var i = 0; i < result.TAarray.length; i++) {
      result.TAarray[i] = result.TAarray[i].split("<sp")[0];
      addNames('TAname', 'TAid', 'TAlist', result.TAarray[i], testAnalysts, deleteTA);
    }
  });
}
function addETAs() {
  chrome.storage.sync.get(['ETAarray'], function (result) {
    for (var i = 0; i < result.ETAarray.length; i++) {
      result.ETAarray[i] = result.ETAarray[i].split("<sp")[0];
      addNames('ETAname', 'ETAid', 'ETAlist', result.TAarray[i], EPAMtestAnalysts, deleteETA);
    }
  });
}
function addSEs() {
  chrome.storage.sync.get(['SEarray'], function (result) {
    for (var i = 0; i < result.SEarray.length; i++) {
      result.SEarray[i] = result.SEarray[i].split("<sp")[0];
      addNames('SEname', 'SEid', 'SElist', result.SEarray[i], softwareEngineers, deleteSE);
    }
  });
}
function addESEs() {
  chrome.storage.sync.get(['ESEarray'], function (result) {
    for (var i = 0; i < result.ESEarray.length; i++) {
      result.ESEarray[i] = result.ESEarray[i].split("<sp")[0];
      addNames('ESEname', 'ESEid', 'ESElist', result.ESEarray[i], EPAMsoftwareEngineers, deleteESE);
    }
  });
}
function addNames(name, id, pointer, text, array, deleter) {
  var list = document.getElementById(pointer);
  var entry = document.createElement('li');
  entry.appendChild(document.createTextNode(text));
  var spanDelete = document.createElement("span");
  spanDelete.setAttribute("class", 'close');
  spanDelete.innerHTML = "&times;";
  list.appendChild(entry);
  entry.appendChild(spanDelete);
  array.push(entry.innerHTML);
  document.getElementById(name).value = '';
  document.getElementById(id).value = '';
  spanDelete.onclick = deleter;
  save_options();
}

