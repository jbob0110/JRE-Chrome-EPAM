var productOwners = [];
var testAnalysts = [];
var softwareEngineers = [];
var teamLead = [];

var isFirefox = typeof InstallTrigger !== 'undefined';
window.onload = () => {
  chrome.storage.sync.get(['POarray'], function (result) {
    if (result.POarray === undefined) {
      chrome.storage.sync.set({ POarray: productOwners }, function () { console.log("Initial product owner array save!"); });
    }
  });
  chrome.storage.sync.get(['TAarray'], function (result) {
    if (result.TAarray === undefined) {
      chrome.storage.sync.set({ TAarray: testAnalysts }, function () { console.log("Initial test analyst array save!"); });
    }
  });
  chrome.storage.sync.get(['SEarray'], function (result) {
    if (result.SEarray === undefined) {
      chrome.storage.sync.set({ SEarray: softwareEngineers }, function () { console.log("Initial software engineer array save!"); });
    }
  });
  chrome.storage.sync.get(['TLarray'], function (result) {
    if (result.TLarray === undefined) {
      chrome.storage.sync.set({ TLarray: teamLead }, function () { console.log("Initial team lead array save!"); });
    }
  });
  addPOs();
  addTAs();
  addSEs();
  addTLs();
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
  document.getElementById('addTL').onclick = () => {
    var name = document.getElementById("TLname").value;
    chrome.storage.sync.get(['TLarray'], function (result) {
      for (var i = 0; i < result.TLarray.length; i++) {
        holder = result.TLarray[i].split(" :");
        teamLead[holder[0]] = true;
      }
      if (teamLead[name] != undefined) {
        alert("Name already on the list.");
        document.getElementById('TLname').value = '';
        document.getElementById('TLid').value = '';
      } else {
        teamLead[name] = true;
        addNames('TLname', 'TLid', 'TLlist', document.getElementById('TLname').value + " :" + document.getElementById('TLid').value, teamLead, deleteTL);
      }
    });
  }
  document.getElementById('clearSyncStorage').onclick = () => {
    chrome.storage.sync.clear(function() {
      var error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        }
     });
     location.reload();
  }
}

function save_options() {
  if (isFirefox) {
    browser.storage.sync.set({
      POarray: productOwners,
      TAarray: testAnalysts,
      SEarray: softwareEngineers,
      TLarray: teamLead
    }, function () {
      console.log("Settings Saved")
    });
  } else {
    chrome.storage.sync.set({
      POarray: productOwners,
      TAarray: testAnalysts,
      SEarray: softwareEngineers,
      TLarray: teamLead
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
function deleteTL(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < teamLead.length; i++) {
    if (!isFirefox) {
      if (teamLead[i] === e.path[1].innerHTML) {
        var holder = teamLead[i].split(" :");
        teamLead[holder[0]] = undefined;
        teamLead.splice(i, 1);
        break;
      }
    } else {
      if (teamLead[i] === e.originalTarget.parentElement.innerHTML) {
        var holder = teamLead[i].split(" :");
        teamLead[holder[0]] = undefined;
        teamLead.splice(i, 1);
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
function addTAs() {
  chrome.storage.sync.get(['TAarray'], function (result) {
    for (var i = 0; i < result.TAarray.length; i++) {
      result.TAarray[i] = result.TAarray[i].split("<sp")[0];
      addNames('TAname', 'TAid', 'TAlist', result.TAarray[i], testAnalysts, deleteTA);
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
function addTLs() {
  chrome.storage.sync.get(['TLarray'], function (result) {
    for (var i = 0; i < result.TLarray.length; i++) {
      result.TLarray[i] = result.TLarray[i].split("<sp")[0];
      addNames('TLname', 'TLid', 'TLlist', result.TLarray[i], teamLead, deleteTL);
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

