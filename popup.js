var jiraKey;
var project;
var jiraInstance;
var url;
var description;
// asyncRequestCount keeps track of when the sub-tasks are being sent.
var asyncRequestCount = 0;
/**This if checks the users browser and grabs their browser information based on this.*/
chrome.tabs.query({
  'active': true,
  'currentWindow': true
},
  function (tabs) {
    url = tabs[0].url;
    getURLs(url);
  }
);

function getURLs(url){
  var re = /https\:\/\/(.+?)\..+\/((.+?)\-[^\?]+)/;
  var regexGroups = {
    jIns: 1,
    jKey: 2,
    pKey: 3
  };
  var m = re.exec(url);
  jiraKey = m[regexGroups.jKey];
  project = m[regexGroups.pKey];
  jiraInstance = m[regexGroups.jIns];
};

function checkAsynRequestCount(){
  if(asyncRequestCount === 0){
    chrome.tabs.reload();
    document.getElementById('loader').style.display = "none";
  }
};

chrome.storage.sync.get(['POarray'], function (result) {
  var x = document.getElementById("POs");
  var option;
  if(result.POarray){
    for (var i = 0; i< result.POarray.length; i++){
      option = document.createElement("option");
      var split = result.POarray[i].split("<spa");
      split = split[0].split(" :");
      option.text = split[0];
      option.value = split[1];
      x.add(option);
    } 
  }
}
);

chrome.storage.sync.get(['TAarray'], function (result) {
  var x = document.getElementById("TAs");
  var option;
  if(result.TAarray){
    for (var i = 0; i< result.TAarray.length; i++){
      option = document.createElement("option");
      var split = result.TAarray[i].split("<spa");
      split = split[0].split(" :");
      option.text = split[0];
      option.value = split[1];
      x.add(option);
    } 
  }
}
);

chrome.storage.sync.get(['SEarray'], function (result) {
  var x = document.getElementById("SEs");
  var option;
  if(result.SEarray){
    for (var i = 0; i< result.SEarray.length; i++){
      option = document.createElement("option");
      var split = result.SEarray[i].split("<spa");
      split = split[0].split(" :");
      option.text = split[0];
      option.value = split[1];
      x.add(option);
    } 
  }
}
);

chrome.storage.sync.get(['TLarray'], function(result) {
  var x = document.getElementById("TLs");
  var option, split;
  if(result.TLarray){
    for(var i = 0; i< result.TLarray.length; i++){
      option = document.createElement("option");
      split = result.TLarray[i].split("<spa");
      split = split[0].split(" :");
      option.text = split[0];
      option.value = split[1];
      x.add(option);
    }
  }
}
);

/**Add Sub-Task Function */
function addSubTask(subtask){
  var xhr = new XMLHttpRequest;
  xhr.open("POST", "https://"+jiraInstance+".cerner.com/rest/api/2/issue/");
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
      asyncRequestCount--;
      checkAsynRequestCount();
    }
  };
  asyncRequestCount++;
  xhr.send(JSON.stringify(subtask));
};

/**PCFRAME Stories SC-Y Button - Sub-Tasks Created */
window.onload = () => {
  document.getElementById('scYesPCFRAMEStory').onclick = () => {
    var Po = document.getElementById('POs').value;
    var Ta = document.getElementById('TAs').value;
    var Se = document.getElementById('SEs').value;
    var Tl = document.getElementById('TLs').value;
    console.log("PO: "+Po);
    console.log("TA: "+Ta);
    console.log("SE: "+Se);
    console.log("TL: "+Tl);
    document.getElementById('loader').style.display = "block";
    
    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Define Requirements",
        "description":"h2. Overview\nWork with strategists, stakeholders and the development team to define requirements for this project. Once ready for review, attach the requirements documentation to the sub-task and request reviewers by @mentioning them. Once posted for review update the status of the sub-task to _In Review_.\n\nh2. Acceptance Criteria\n # Define the requirements for the story\n # Post the completed Project Requirement for Jazz review\n # Address comments as they are provided by reviewers\n # Close the sub-task once reviewers have given their +1 and requirements have been finalized\n\nh2. Audits Performed\n*Parent Issue Audits*\n * Does the Define Requirements sub-task exist?\n*Sub-Task Audits*\n * Has the sub-task been closed?\n * Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n  ** The parent issue also has a resolution that no work is needed.\n * Has a <Project requirement template > been filled out and attached for review on the sub-task?\n * Has a PDF file containing the extracted updated requirements wiki been attached?\n * Has a +1 comment been provided by someone other than the sub-task assignee?",
        "assignee":{
          "name": Po
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Define Requirements Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Perform Hazard Analysis",
        "description":"h2. Overview\nWork with the Agile team to determine if the story impacts any of the following Hazards. Reference our current wiki page for our existing <Hazard Analysis document link>.\nh2. Acceptance Criteria:\n * Document with a Yes or No if your story impacts any of the following hazard types. If yes, explain why.\n ** Financial: <yes or no. If yes, explain why>\n ** Legal/Regulatory: <yes or no. If yes, explain why>\n ** Data Integrity: <yes or no. If yes, explain why>\n ** Patient Safety: <yes or no. If yes, explain why>\n ** CyberSecurity/Information Security: <yes or no. If yes, explain why>\n * Engineer assigned to the project has added a +1 indicating that they discussed the impact this story has with regards to Hazards and agrees with the assessment.\n\nh2. Audits Performed\n\n*Parent Issue Audits*\n * Does the Perform Hazard Analysis sub-task exist?\n\n*Sub-Task Audits*\n * Has the sub-task been closed?\n * Has a resolution been given that no work is needed on the sub-task (Not Applicable, Duplicate, etc...) and is it valid? Valid scenarios are detailed below.\n ** The parent issue also has a resolution that no work is needed.\n * Have the hazard analysis questions have been filled out in the Description field of the sub-task.\n ** If so, has a +1 comment been provided by someone other than the sub-task assignee?\n",
        "assignee":{
          "name": Po
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Perform Hazard Analysis Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Technical Design Document",
        "description":"h2. Overview\nCreate a technical design document outlining your proposed changes for this story.  When writing your technical design document you can utilize the [Microsoft Word Technical Design Template|https://wiki.cerner.com/display/public/IPDevConDoc/PowerChart+Enhancement+Design+Template] .  When using the Microsoft Word template, attach the document to this sub-task and request reviewers by @mentioning them.  Once posted for review, update the status of the sub-task to _In Review_.  Once all reviews are completed and the technical design document has been finalized, close the sub-task.\n\nh2. Acceptance Criteria\n# Write the technical design document outlining your proposed changes\n# If using the [Microsoft Word Technical Design Template|https://wiki.cerner.com/display/public/IPDevConDoc/MPages+Platform+Development+Technical+Design+Template]\n## Attach the completed document to this sub-task for review\n## Address comments as they are provided by reviewers\n# Close the sub-task once all reviewers have completed their reviews and the technical design document has been finalized\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Technical Design Document sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Has a technical design document been attached for review?\n** If so, has a +1 comment been provided by someone other than the sub-task owner?\n* Has a pull request been created for review?\n** If so, is the pull request merged?\n",
        "assignee":{
          "name": Se
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Technical Design Document Sent");
    
    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Unit and Boundary Testing",
        "description":"h2. Overview\nWrite any necessary unit tests for code being introduced or altered which cover all logic paths and boundary conditions.  If time permits, perform additional unit testing on existing code which is not currently covered.  Once you've completed unit testing, create a pull request to review the updates and add a _Web Link_ to it in this sub-task.  Be sure to attach the evidence ZIP file of a successful unit test run and code coverage to the pull request.  Once posted for review update the status of the sub-task to In _Review_.\n\n{panel:bgColor=#fffcd8}Crucible code reviews are also accepted.  All of the same expectations apply to code reviews completed in Crucible{panel}\n\nh2. Acceptance Criteria\n# Write the unit tests which cover all logic paths and boundary conditions for any code being introduce or altered\n# Create a pull request in the necessary repository and add a _Web Link_ to it in this sub-task\n# Address comments as they are provided by reviewers\n# Merge your pull request\n# Close the sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Unit and Boundary Testing sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Has a pull request to review the unit testing been created and linked in the sub-task?\n* Has an evidence ZIP file been attached to the pull request?\n* Has the pull request been merged?\n",
        "assignee":{
          "name": Se
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Unit and Boundary Testing");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Gray Box / Formal White Box Testing",
        "description":"h2. Overview\nIt's possible that both gray box and formal white box testing will be completed for a single story.  However, at least one is required.  See the sections below based on which you will be performing.\n\n*Gray Box Tests*\nUpdate or create new gray box tests which cover the changes being made in this story.  If time permits, perform additional gray box testing on existing scenarios which are not covered.  Once you've completed gray box testing, create a pull request to review the updates and add a _Web Link_ to it in this sub-task.  Be sure to attach evidence of a successful gray box test run.  Once posted for review update the status of the sub-task to _In Review_.\n\n*Formal White Box Tests*\nFormal white box test plans may not always be needed.  If they are needed, create the formal white box test plan which covers any functionality which cannot be covered with traditional testing.  Once ready for review, attach the test plan to the sub-task and request reviewers by @mentioning them.  Update the status of the sub-task to _In Review_.\n\nh2. Acceptance Criteria\n*Gray Box Tests*\n# Write the gray box tests which cover the changes being made in this story\n# Create a pull request in the necessary repository and add a _Web Link_ to it in this sub-task\n# Address comments as they are provided by reviewers\n# Merge your pull request\n## Gray box evidence is attached to the this sub-task?\n# Close the sub-task\n\n*Formal White Box*\n# Write the formal white box test plan\n# Attach the test plan for review\n# Address comments as they are provided by reviewers\n# Run the formal white box test plan and attach the test run evidence\n# Close the sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Gray Box / Formal White Box Testing sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Has a pull request been created and linked in the sub-task?\n** Has the pull request been merged?\n** Is gray box evidence attached to the sub-task\n* Has a formal white box test plan been attached?\n** Has a +1 comment been provided by someone other than the sub-task assignee?\n** Has evidence of a formal white box test run been attached?\n",
        "assignee":{
          "name": Se
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Gray Box / Formal White Box Testing Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Code Review",
        "description":"h2. Overview\nAs you work through the implementation of this project, create code reviews for any artifacts you've made modifications to.  Reviews can be held in either Crucible or GitHub and should be linked to from this sub-task using a _Web Link_.  If you are making updates to multiple artifacts, @mention associates you would like to review your work so they have visibility to all changes being made.  Once you've posted code for review, update the status of this sub-task to _In Review_.  Once you've made all necessary changes and closed/merged your reviews, close the sub-task.\n\nh2. Acceptance Criteria\n# Implement the change needed for the Story / Defect\n# Create code reviews and pull requests so others can review your work\n# Update the status of this sub-task to _In Review_\n# Address comments as they are provided and post additional commits as necessary\n# Close / Merge reviews as they are completed\n# Close this sub-task once all reviews are completed\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Code Review sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Are there any code reviews or pull requests linked in the sub-task?\n* Are all linked reviews closed / merged?",
        "assignee":{
          "name": Se
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Code Review Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Test Case Design",
        "description":"h2. Overview\n\nIdentify any test plan designs which need to be modified or created for this project. Utilize the *<test plan design template>* when creating a new test plan design, otherwise, update the design page that is posted by *<requirements>*. Once you've finished making your changes, add _Web Links_ to each wiki page, comment which test plans apply to the project, request reviewers by @mentioning them and update the status of this sub-task to _In Review_. As reviewers provide comments make updates to the test plan designs. Once all changes have been finalized, close this sub-task.\n{panel:bgColor=#fffcd8}If there are existing test plan designs which already cover the functionality of this project, add _Web Links_ to each of those pages and comment which specific test plans apply to the project.{panel}\nh2. Acceptance Criteria\n # Identify test plan designs which need to be modified or created\n # Add _Web Links_ to each page that is being updated\n ** If no updates were necessary, add _Web Links_ to the existing test plan designs which cover the functionality of this project\n # Comment which test plans apply for the project\n # Address comments as they are provided by reviewers\n # Close the sub-task once reviewers have given their +1 and the test plan designs have been finalized\n ** If no updates were necessary, reviewers will be giving a +1 that all functionality is covered in the existing pages\n\nh2. Audits Performed\n\n*Parent Issue Audits*\n * Does the Test Plan Design sub-task exist?\n\n*Sub-Task Audits*\n * Is the sub-task closed?\n * Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n ** The parent issue also has a resolution that no work is needed.\n ** A white box test plan has been developed, posted for review and executed under the Gray Box / Formal White Box Testing sub-task\n * Have any links to wiki documents been added as _Web Links_ in this sub-task?\n * Has a +1 comment been provided by someone other than the sub-task assignee?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Test Case Design Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Test Case Development, Automation, and Review",
        "description":"h2.Overview\nMultiple types of testing may need to be created to cover all of the changes for this Story / Defect.  Follow the guidance below to determine what steps should be taken based on the test type.\n\n*Manual Vertical Regression, Session Based Exploratory Testing (SBET) or User Interface (UI) test plans*\nIf creating or updating any of these testing types, make your changes in RQM and export the updated test plan as a PDF file.  Attach that file for review in the sub-task, request reviewers by @mentioning them and update the status of the sub-task to _In Review_.  Once all comments have been addressed and reviewers have given their +1, attach the finalized PDF to the sub-task.\n\n*Automated Test Plans*\nIf creating automated test plans, perform the code changes and create a pull request for each test being modified.  For each pull request add a _Web Link_ to it in this sub-task.  Update the status of the sub-task to _In Review_.  Once all reviews are merged, close the sub-task\n\nh2. Acceptance Criteria\n*Manual Vertical Regression, Session Based Exploratory Testing (SBET) or User Interface (UI) test plans*\n# Create or update any test plans which cover the changes being made in this story\n# Export the test plans to a PDF and attach to this sub-task for review\n# Address comments as they are provided by reviewers\n# Close the sub-task once reviewers have given their +1 and the test plans have been finalized\n\n*Automated Test Plans*\n# Write the automated tests which cover the changes being made in this story\n# Create a pull request in the necessary repositories and add _Web Links_ to them in this sub-task\n# Address comments as they are provided by reviewers\n# Merge your pull requests\n# Close the sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Test Plan Development, Automation, and Review sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (Not Applicable, Duplicate, etc...) and is it valid?  Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n** A white box test plan has been developed, posted for review and executed under the Gray Box /  Formal White Box Testing sub-task.\n* Has a PDF file been attached for review?\n** If so, has a +1 comment been provided by someone other than the sub-task assignee?\n* Has a pull request been linked in the sub-task?\n** If so, are all reviews merged?\n",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Test Case Development, Automation, and Review Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Test Case Tracing",
        "description":"h2. Overview\nOnce test plans have been reviewed and uploaded to the appropriate location, update all requirements pages with links to the test plans that cover the listed requirement for this project.  Once completed, add _Web Links_ to this sub-task linking out to the requirements documents which were updated.\n\nTest plan tracing should be completed for the following test types:\n* Gray Box Test Plans\n* Formal White Box Test Plans\n* Manual Vertical Regression Test Plans\n* Manual SBET Test Plans\n* Manual UI Test Plans\n* Automated Vertical Regression Test Plans\n\nh2. Acceptance Criteria\n Update all requirements wikis with links to the test plans that cover the requirements listed for this project.\n# Add a _Web Link_ to this sub-task for each requirements page updated\n# Close the sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Test Plan Tracing sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Have links to the updated requirements wiki been posted?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Test Case Tracing Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Certification Guideline Creation",
        "description":"h2. Overview\nFor client viewable solution changes, a certification guideline detailing how clients will test enhancements / defects is needed.  Create the appropriate document outlining the necessary steps for client testing.  Once ready for review, attach the certification guideline to the sub-task and request reviewers by @mentioning them.  Once posted for review update the status of the sub-task to _In Review_.\n\n{panel:bgColor=#fffcd8}If this story does not contain a solution change (External Key) or the solution change is non-client viewable, you can close this sub-task as _Not Applicable_{panel}\n\nh2. Acceptance Criteria\n# Write the certification guideline testing steps\n# Attach the completed document to this sub-task for review\n# Address comments as the are provided by reviewers\n# Close the sub-task once reviewers have given their +1 and the certification guideline has been finalized\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Certification Guideline Creation sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n** The parent issue does not contain a solution change (_External Key_)\n** The parent issue's solution change (_External Key_) is not client viewable\n* Is a certification guideline document attached?\n** If a certification guideline is attached, does it contain the solution change number in the file name?\n* Has a +1 comment been provided by someone other than the sub-task assignee?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Certification Guideline Creation Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Technical Writer Request",
        "description":"h2. Overview\nPrior to delivering projects to clients we must ensure all of our documentation is complete and accurate.  We employ the assistance of Technical Writers to help us with this.  If any of the following documents are being created or modified a [PRODOC|https://jira.cerner.com/projects/PRODOC] issue should be logged so they can be reviewed by a Technical Writer.\n* Certification Guideline\n* Reference Pages\n* Help Pages\n\nWhen logging the PRODOC issue, utilize the following details:\n* Type: Documentation Enhancement\n* Team: CernerKC\n* Description: Provide a brief description of the project\n* Assignee: Select the Technical Writer assigned to our team\n\n{panel:bgColor=#fffcd8}If no client facing documentation has been created or modified, you can close this sub-task as _Not Applicable_.{panel}\n\nh2. Acceptance Criteria\n# Create the PRODOC JIRA issue\n# Attach any certification guideline documents for review\n# Add _Web Link_ links to any reference or help pages that have been created or modified\n# Link to the created PRODOC issue from this sub-task using the _JIRA Issue_ link type\n#* Be sure to select _JIRA_ from the _Server_ drop down selection\n# Close this sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Technical Writer Request sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n** The parent issue does not contain a solution change (_External Key_)\n** The parent issue's solution change (_External Key_) is not client viewable\n* Has a PRODOC jira issue been linked from the sub-task?\n**  Does it contain an attached certification guideline?\n*** Note: Certification guideline is only required if the parent issue has a client viewable solution change.",
        "assignee":{
          "name": Po
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Technical Writer Request");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Complete Design IO Form",
        "description":"h2. Overview\nWhen finishing up a project we must document certain steps of the software development process to abide by federal regulations.  In order to do this we create and fill out a Design Input / Output form with project identifiers, links to locations where work has been completed and any other materials which show a development process was followed.  Ensure the following information is provided in the Design Input / Output Issue:\n\n*General Tab*\n* Solution\n* Solution Details\n* JIRA Group\n* Project identifiers\n\n*Design Input Tab*\n* Requirements: Provide links to the 'Define Requirements' sub-tasks for this project\n* Project Traceability: Provide links to the 'Define Requirements' sub-tasks for this project since they provide direct access to the requirements and/or hazards that apply to the project.\n\n*Design Output Tab*\n* Technical Design Document: Provide links to any technical design document reviews for the project\n* Source Code: Provide links to any code reviews for the project\n\nAdditionally, you should check the Approvals tab to make sure all signatures have been gathered.\n\nh2. Acceptance Criteria\n# Ensure this project has an associated Design IO form\n#* The Design IO form should be linked in the parent Story / Defect or possibly in an ancestral Epic.\n# Check that all of the Design IO tabs are filled our appropriately\n# Ensure all signatures have been collected\n# Close this sub-task once all details have been documented for this Story / Defect\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Complete Design IO Form sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.",
        "assignee":{
          "name": Po
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Complete Design IO Form Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Story Review / Merge Code",
        "description":"h2. Overview\n\nThe team lead should perform an evaluation of the story to ensure all work was completed as per the Powerchart framework development process and all evidence created when executing that process is discoverable. Once confirmed, merge any features which are ready for validation testing. Once all features have merged, close this sub-task.\nh2. Acceptance Criteria\n # Evaluate the story to ensure the Powerchart development process was followed and all evidence is discoverable\n # Merge any features associated with this Story / Defect\n # Close this sub-task\n\nh2. Audits Performed\n\n*Parent Issue Audits*\n * Does the Story Review / Merge Code sub-task exist\n\n*Sub-Task Audits*\n * Has the sub-task been closed?\n * Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed\nbelow.\n ** The parent issue also has a resolution that no work is needed.",
        "assignee":{
          "name": Tl
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Story Review / Merge Code Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Unscripted Testing",
        "description":"h2. Overview\nUnscripted testing should be completed at the same time as code reviews are being performed.  This will allow your team to identify issues when code is still being actively developed.  It is the responsibility of the Engineer to setup a location where their changes can be easily tested by other associates.  Once setup is complete, details on how to access the testing environment should be provided in this sub-task.  When you are ready for unscripted testing to begin, @mention the associates you would like to assist you with testing.  Any issues identified should be addressed and re deployed back out to the testing environment.  Once all testers have completed their unscripted testing, they should leave a +1 comment on this sub-task to signify that they were able to test successfully.\n\n*Considerations*\n# If there is an equivalent workflow in Win64, be sure to include testing the equivalent steps/UI with unscripted testing.\n# Include all relevant associates in the unscripted testing session (up to and including subject-matter experts, strategists, UX designers, solution designers, and so on.\n\nh2. Acceptance Criteria\n# Setup a location where testing can take place\n# Detail any information needed by testers in this sub-task\n# Address issues as they are discovered by unscripted testers\n# Close the sub-task once all unscripted testers have given their +1 and the code has been finalized\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Unscripted Testing sub-task exist\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Has a +1 comment been provided by someone other than the sub-task assignee?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Unscripted Testing Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Validation Testing",
        "description":"h2. Overview\nOnce the code for a project has reached a location where validation testing can be performed, update the status of this sub-task to _In Progress_.  Run any validation tests necessary to cover the modifications made in this Story / Defect.  If an issue is discovered, update the status of the sub-task to 'Blocked' and log a [CERTMPAGES|https://jira.cerner.com/projects/CERTMPAGES] issue providing details on how to recreate it.  Be sure to link to the CERTMPAGES issue from this sub-task.  Once all validation testing has completed successfully and all CERTMPAGE issues are addressed, close this sub-task.\n\nh2. Acceptance Criteria\n# Update the status of this sub-task to _In Progress_\n# Run any validation tests which cover the functionality for the project\n# If issues are discovered, log a CERTMPAGES issue and link to it from this sub-task\n# Once all tests are run successfully and all CERTMPAGES issues are addressed, close this sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Validation Testing sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid?  Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n** A white box test plan has been developed, posted for review and executed under the Gray Box /  Formal White Box Testing sub-task.\n* If any CERTMPAGES issues are linked, are they closed?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Validation Testing Sent")
  };

  /**PCFRAME Defects SC-Y Button - Sub-Tasks Created */
  document.getElementById('scYesPCFRAMEDefect').onclick = () => {
    var Po = document.getElementById('POs').value;
    var Ta = document.getElementById('TAs').value;
    var Se = document.getElementById('SEs').value;
    var Tl = document.getElementById('TLs').value;
    console.log("PO: "+Po);
    console.log("TA: "+Ta);
    console.log("SE: "+Se);
    console.log("TL: "+Tl);
    document.getElementById('loader').style.display = "block";
      
    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Define Requirements",
        "description":"h2. Overview\nWork with strategists, stakeholders and the development team to define requirements for this project. Once ready for review, attach the requirements documentation to the sub-task and request reviewers by @mentioning them. Once posted for review update the status of the sub-task to _In Review_.\n\nh2. Acceptance Criteria\n # Define the requirements for the story\n # Post the completed Project Requirement for Jazz review\n # Address comments as they are provided by reviewers\n # Close the sub-task once reviewers have given their +1 and requirements have been finalized\n\nh2. Audits Performed\n*Parent Issue Audits*\n * Does the Define Requirements sub-task exist?\n*Sub-Task Audits*\n * Has the sub-task been closed?\n * Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n  ** The parent issue also has a resolution that no work is needed.\n * Has a <Project requirement template > been filled out and attached for review on the sub-task?\n * Has a PDF file containing the extracted updated requirements wiki been attached?\n * Has a +1 comment been provided by someone other than the sub-task assignee?",
        "assignee":{
          "name": Po
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Define Requirements Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Perform Hazard Analysis",
        "description":"h2. Overview\nWork with the Agile team to determine if the story impacts any of the following Hazards. Reference our current wiki page for our existing <Hazard Analysis document link>.\nh2. Acceptance Criteria:\n * Document with a Yes or No if your story impacts any of the following hazard types. If yes, explain why.\n ** Financial: <yes or no. If yes, explain why>\n ** Legal/Regulatory: <yes or no. If yes, explain why>\n ** Data Integrity: <yes or no. If yes, explain why>\n ** Patient Safety: <yes or no. If yes, explain why>\n ** CyberSecurity/Information Security: <yes or no. If yes, explain why>\n * Engineer assigned to the project has added a +1 indicating that they discussed the impact this story has with regards to Hazards and agrees with the assessment.\n\nh2. Audits Performed\n\n*Parent Issue Audits*\n * Does the Perform Hazard Analysis sub-task exist?\n\n*Sub-Task Audits*\n * Has the sub-task been closed?\n * Has a resolution been given that no work is needed on the sub-task (Not Applicable, Duplicate, etc...) and is it valid? Valid scenarios are detailed below.\n ** The parent issue also has a resolution that no work is needed.\n * Have the hazard analysis questions have been filled out in the Description field of the sub-task.\n ** If so, has a +1 comment been provided by someone other than the sub-task assignee?\n",
        "assignee":{
          "name": Po
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Perform Hazard Analysis Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Root Cause Analysis",
        "description":"h2. Overview\n\nPerform the root cause analysis for this Solution Change. More details on performing the root cause analysis task can be found in the <Root cause analysis guide> and the <development process> wikis.\n{panel:bgColor=#fffcd8}\nIf your story is not a defect you can close this sub-task as _Not Applicable_.\n{panel}\nh2. Acceptance Criteria\n # Fill out the fields listed below on the parent JIRA issue.\n ** Root Cause Classification\n ** Root Cause Comment\n ** Preventative Action Type\n  ** Preventative Action Type Comment\n # Identify the project which introduced this issue and add an _Introduced By_ link on the parent issue. When linking, the Solution Change field should be the JIRA key (PCFRAME-XXX). If a JIRA key is not available the Solution Change number can be used. If you cannot locate either, then set the _Latent Defect_ field to yes in the parent issue.\n # Close the sub-task\n\nh2. Audits Performed\n\n*Parent Issue Audits*\n * Does the Root Cause Analysis sub-task exist?\n * Have the required Root Cause Analysis fields been filled out?\n * Has an _Introduced By_ link been provided?\n\n*Sub-Task Audits*\n * Has the sub-task been closed?\n * Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n ** The parent issue also has a resolution that no work is needed.\n ** The parent issue is not a defect",
        "assignee":{
          "name": Se
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Root Cause Analysis Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Technical Design Document",
        "description":"h2. Overview\nCreate a technical design document outlining your proposed changes for this story.  When writing your technical design document you can utilize the [Microsoft Word Technical Design Template|https://wiki.cerner.com/display/public/IPDevConDoc/PowerChart+Enhancement+Design+Template] .  When using the Microsoft Word template, attach the document to this sub-task and request reviewers by @mentioning them.  Once posted for review, update the status of the sub-task to _In Review_.  Once all reviews are completed and the technical design document has been finalized, close the sub-task.\n\nh2. Acceptance Criteria\n# Write the technical design document outlining your proposed changes\n# If using the [Microsoft Word Technical Design Template|https://wiki.cerner.com/display/public/IPDevConDoc/MPages+Platform+Development+Technical+Design+Template]\n## Attach the completed document to this sub-task for review\n## Address comments as they are provided by reviewers\n# Close the sub-task once all reviewers have completed their reviews and the technical design document has been finalized\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Technical Design Document sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Has a technical design document been attached for review?\n** If so, has a +1 comment been provided by someone other than the sub-task owner?\n* Has a pull request been created for review?\n** If so, is the pull request merged?\n",
        "assignee":{
          "name": Se
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Technical Design Document Sent");
    
    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Unit and Boundary Testing",
        "description":"h2. Overview\nWrite any necessary unit tests for code being introduced or altered which cover all logic paths and boundary conditions.  If time permits, perform additional unit testing on existing code which is not currently covered.  Once you've completed unit testing, create a pull request to review the updates and add a _Web Link_ to it in this sub-task.  Be sure to attach the evidence ZIP file of a successful unit test run and code coverage to the pull request.  Once posted for review update the status of the sub-task to In _Review_.\n\n{panel:bgColor=#fffcd8}Crucible code reviews are also accepted.  All of the same expectations apply to code reviews completed in Crucible{panel}\n\nh2. Acceptance Criteria\n# Write the unit tests which cover all logic paths and boundary conditions for any code being introduce or altered\n# Create a pull request in the necessary repository and add a _Web Link_ to it in this sub-task\n# Address comments as they are provided by reviewers\n# Merge your pull request\n# Close the sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Unit and Boundary Testing sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Has a pull request to review the unit testing been created and linked in the sub-task?\n* Has an evidence ZIP file been attached to the pull request?\n* Has the pull request been merged?\n",
        "assignee":{
          "name": Se
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Unit and Boundary Testing");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Gray Box / Formal White Box Testing",
        "description":"h2. Overview\nIt's possible that both gray box and formal white box testing will be completed for a single story.  However, at least one is required.  See the sections below based on which you will be performing.\n\n*Gray Box Tests*\nUpdate or create new gray box tests which cover the changes being made in this story.  If time permits, perform additional gray box testing on existing scenarios which are not covered.  Once you've completed gray box testing, create a pull request to review the updates and add a _Web Link_ to it in this sub-task.  Be sure to attach evidence of a successful gray box test run.  Once posted for review update the status of the sub-task to _In Review_.\n\n*Formal White Box Tests*\nFormal white box test plans may not always be needed.  If they are needed, create the formal white box test plan which covers any functionality which cannot be covered with traditional testing.  Once ready for review, attach the test plan to the sub-task and request reviewers by @mentioning them.  Update the status of the sub-task to _In Review_.\n\nh2. Acceptance Criteria\n*Gray Box Tests*\n# Write the gray box tests which cover the changes being made in this story\n# Create a pull request in the necessary repository and add a _Web Link_ to it in this sub-task\n# Address comments as they are provided by reviewers\n# Merge your pull request\n## Gray box evidence is attached to the this sub-task?\n# Close the sub-task\n\n*Formal White Box*\n# Write the formal white box test plan\n# Attach the test plan for review\n# Address comments as they are provided by reviewers\n# Run the formal white box test plan and attach the test run evidence\n# Close the sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Gray Box / Formal White Box Testing sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Has a pull request been created and linked in the sub-task?\n** Has the pull request been merged?\n** Is gray box evidence attached to the sub-task\n* Has a formal white box test plan been attached?\n** Has a +1 comment been provided by someone other than the sub-task assignee?\n** Has evidence of a formal white box test run been attached?\n",
        "assignee":{
          "name": Se
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Gray Box / Formal White Box Testing Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Code Review",
        "description":"h2. Overview\nAs you work through the implementation of this project, create code reviews for any artifacts you've made modifications to.  Reviews can be held in either Crucible or GitHub and should be linked to from this sub-task using a _Web Link_.  If you are making updates to multiple artifacts, @mention associates you would like to review your work so they have visibility to all changes being made.  Once you've posted code for review, update the status of this sub-task to _In Review_.  Once you've made all necessary changes and closed/merged your reviews, close the sub-task.\n\nh2. Acceptance Criteria\n# Implement the change needed for the Story / Defect\n# Create code reviews and pull requests so others can review your work\n# Update the status of this sub-task to _In Review_\n# Address comments as they are provided and post additional commits as necessary\n# Close / Merge reviews as they are completed\n# Close this sub-task once all reviews are completed\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Code Review sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Are there any code reviews or pull requests linked in the sub-task?\n* Are all linked reviews closed / merged?",
        "assignee":{
          "name": Se
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Code Review Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Test Case Design",
        "description":"h2. Overview\n\nIdentify any test plan designs which need to be modified or created for this project. Utilize the *<test plan design template>* when creating a new test plan design, otherwise, update the design page that is posted by *<requirements>*. Once you've finished making your changes, add _Web Links_ to each wiki page, comment which test plans apply to the project, request reviewers by @mentioning them and update the status of this sub-task to _In Review_. As reviewers provide comments make updates to the test plan designs. Once all changes have been finalized, close this sub-task.\n{panel:bgColor=#fffcd8}If there are existing test plan designs which already cover the functionality of this project, add _Web Links_ to each of those pages and comment which specific test plans apply to the project.{panel}\nh2. Acceptance Criteria\n # Identify test plan designs which need to be modified or created\n # Add _Web Links_ to each page that is being updated\n ** If no updates were necessary, add _Web Links_ to the existing test plan designs which cover the functionality of this project\n # Comment which test plans apply for the project\n # Address comments as they are provided by reviewers\n # Close the sub-task once reviewers have given their +1 and the test plan designs have been finalized\n ** If no updates were necessary, reviewers will be giving a +1 that all functionality is covered in the existing pages\n\nh2. Audits Performed\n\n*Parent Issue Audits*\n * Does the Test Plan Design sub-task exist?\n\n*Sub-Task Audits*\n * Is the sub-task closed?\n * Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n ** The parent issue also has a resolution that no work is needed.\n ** A white box test plan has been developed, posted for review and executed under the Gray Box / Formal White Box Testing sub-task\n * Have any links to wiki documents been added as _Web Links_ in this sub-task?\n * Has a +1 comment been provided by someone other than the sub-task assignee?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Test Case Design Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Test Case Development, Automation, and Review",
        "description":"h2. Overview\nMultiple types of testing may need to be created to cover all of the changes for this Story / Defect.  Follow the guidance below to determine what steps should be taken based on the test type.\n\n*Manual Vertical Regression, Session Based Exploratory Testing (SBET) or User Interface (UI) test plans*\nIf creating or updating any of these testing types, make your changes in RQM and export the updated test plan as a PDF file.  Attach that file for review in the sub-task, request reviewers by @mentioning them and update the status of the sub-task to _In Review_.  Once all comments have been addressed and reviewers have given their +1, attach the finalized PDF to the sub-task.\n\n*Automated Test Plans*\nIf creating automated test plans, perform the code changes and create a pull request for each test being modified.  For each pull request add a _Web Link_ to it in this sub-task.  Update the status of the sub-task to _In Review_.  Once all reviews are merged, close the sub-task\n\nh2. Acceptance Criteria\n*Manual Vertical Regression, Session Based Exploratory Testing (SBET) or User Interface (UI) test plans*\n# Create or update any test plans which cover the changes being made in this story\n# Export the test plans to a PDF and attach to this sub-task for review\n# Address comments as they are provided by reviewers\n# Close the sub-task once reviewers have given their +1 and the test plans have been finalized\n\n*Automated Test Plans*\n# Write the automated tests which cover the changes being made in this story\n# Create a pull request in the necessary repositories and add _Web Links_ to them in this sub-task\n# Address comments as they are provided by reviewers\n# Merge your pull requests\n# Close the sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Test Plan Development, Automation, and Review sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (Not Applicable, Duplicate, etc...) and is it valid?  Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n** A white box test plan has been developed, posted for review and executed under the Gray Box /  Formal White Box Testing sub-task.\n* Has a PDF file been attached for review?\n** If so, has a +1 comment been provided by someone other than the sub-task assignee?\n* Has a pull request been linked in the sub-task?\n** If so, are all reviews merged?\n",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Test Case Development, Automation, and Review Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Test Case Tracing",
        "description":"h2. Overview\nOnce test plans have been reviewed and uploaded to the appropriate location, update all requirements pages with links to the test plans that cover the listed requirement for this project.  Once completed, add _Web Links_ to this sub-task linking out to the requirements documents which were updated.\n\nTest plan tracing should be completed for the following test types:\n* Gray Box Test Plans\n* Formal White Box Test Plans\n* Manual Vertical Regression Test Plans\n* Manual SBET Test Plans\n* Manual UI Test Plans\n* Automated Vertical Regression Test Plans\n\nh2. Acceptance Criteria\n Update all requirements wikis with links to the test plans that cover the requirements listed for this project.\n# Add a _Web Link_ to this sub-task for each requirements page updated\n# Close the sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Test Plan Tracing sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Have links to the updated requirements wiki been posted?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Test Case Tracing Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Certification Guideline Creation",
        "description":"h2. Overview\nFor client viewable solution changes, a certification guideline detailing how clients will test enhancements / defects is needed.  Create the appropriate document outlining the necessary steps for client testing.  Once ready for review, attach the certification guideline to the sub-task and request reviewers by @mentioning them.  Once posted for review update the status of the sub-task to _In Review_.\n\n{panel:bgColor=#fffcd8}If this story does not contain a solution change (External Key) or the solution change is non-client viewable, you can close this sub-task as _Not Applicable_{panel}\n\nh2. Acceptance Criteria\n# Write the certification guideline testing steps\n# Attach the completed document to this sub-task for review\n# Address comments as the are provided by reviewers\n# Close the sub-task once reviewers have given their +1 and the certification guideline has been finalized\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Certification Guideline Creation sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n** The parent issue does not contain a solution change (_External Key_)\n** The parent issue's solution change (_External Key_) is not client viewable\n* Is a certification guideline document attached?\n** If a certification guideline is attached, does it contain the solution change number in the file name?\n* Has a +1 comment been provided by someone other than the sub-task assignee?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Certification Guideline Creation Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Technical Writer Request",
        "description":"h2. Overview\nPrior to delivering projects to clients we must ensure all of our documentation is complete and accurate.  We employ the assistance of Technical Writers to help us with this.  If any of the following documents are being created or modified a [PRODOC|https://jira.cerner.com/projects/PRODOC] issue should be logged so they can be reviewed by a Technical Writer.\n* Certification Guideline\n* Reference Pages\n* Help Pages\n\nWhen logging the PRODOC issue, utilize the following details:\n* Type: Documentation Enhancement\n* Team: CernerKC\n* Description: Provide a brief description of the project\n* Assignee: Select the Technical Writer assigned to our team\n\n{panel:bgColor=#fffcd8}If no client facing documentation has been created or modified, you can close this sub-task as _Not Applicable_.{panel}\n\nh2. Acceptance Criteria\n# Create the PRODOC JIRA issue\n# Attach any certification guideline documents for review\n# Add _Web Link_ links to any reference or help pages that have been created or modified\n# Link to the created PRODOC issue from this sub-task using the _JIRA Issue_ link type\n#* Be sure to select _JIRA_ from the _Server_ drop down selection\n# Close this sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Technical Writer Request sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n** The parent issue does not contain a solution change (_External Key_)\n** The parent issue's solution change (_External Key_) is not client viewable\n* Has a PRODOC jira issue been linked from the sub-task?\n**  Does it contain an attached certification guideline?\n*** Note: Certification guideline is only required if the parent issue has a client viewable solution change.",
        "assignee":{
          "name": Po
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Technical Writer Request");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Complete Design IO Form",
        "description":"h2. Overview\nWhen finishing up a project we must document certain steps of the software development process to abide by federal regulations.  In order to do this we create and fill out a Design Input / Output form with project identifiers, links to locations where work has been completed and any other materials which show a development process was followed.  Ensure the following information is provided in the Design Input / Output Issue:\n\n*General Tab*\n* Solution\n* Solution Details\n* JIRA Group\n* Project identifiers\n\n*Design Input Tab*\n* Requirements: Provide links to the 'Define Requirements' sub-tasks for this project\n* Project Traceability: Provide links to the 'Define Requirements' sub-tasks for this project since they provide direct access to the requirements and/or hazards that apply to the project.\n\n*Design Output Tab*\n* Technical Design Document: Provide links to any technical design document reviews for the project\n* Source Code: Provide links to any code reviews for the project\n\nAdditionally, you should check the Approvals tab to make sure all signatures have been gathered.\n\nh2. Acceptance Criteria\n# Ensure this project has an associated Design IO form\n#* The Design IO form should be linked in the parent Story / Defect or possibly in an ancestral Epic.\n# Check that all of the Design IO tabs are filled our appropriately\n# Ensure all signatures have been collected\n# Close this sub-task once all details have been documented for this Story / Defect\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Complete Design IO Form sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.",
        "assignee":{
          "name": Po
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Complete Design IO Form Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Story Review / Merge Code",
        "description":"h2. Overview\n\nThe team lead should perform an evaluation of the story to ensure all work was completed as per the Powerchart framework development process and all evidence created when executing that process is discoverable. Once confirmed, merge any features which are ready for validation testing. Once all features have merged, close this sub-task.\nh2. Acceptance Criteria\n # Evaluate the story to ensure the Powerchart development process was followed and all evidence is discoverable\n # Merge any features associated with this Story / Defect\n # Close this sub-task\n\nh2. Audits Performed\n\n*Parent Issue Audits*\n * Does the Story Review / Merge Code sub-task exist\n\n*Sub-Task Audits*\n * Has the sub-task been closed?\n * Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed\nbelow.\n ** The parent issue also has a resolution that no work is needed.",
        "assignee":{
          "name": Tl
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Story Review / Merge Code Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Unscripted Testing",
        "description":"h2. Overview\nUnscripted testing should be completed at the same time as code reviews are being performed.  This will allow your team to identify issues when code is still being actively developed.  It is the responsibility of the Engineer to setup a location where their changes can be easily tested by other associates.  Once setup is complete, details on how to access the testing environment should be provided in this sub-task.  When you are ready for unscripted testing to begin, @mention the associates you would like to assist you with testing.  Any issues identified should be addressed and re deployed back out to the testing environment.  Once all testers have completed their unscripted testing, they should leave a +1 comment on this sub-task to signify that they were able to test successfully.\n\n*Considerations*\n# If there is an equivalent workflow in Win64, be sure to include testing the equivalent steps/UI with unscripted testing.\n# Include all relevant associates in the unscripted testing session (up to and including subject-matter experts, strategists, UX designers, solution designers, and so on.\n\nh2. Acceptance Criteria\n# Setup a location where testing can take place\n# Detail any information needed by testers in this sub-task\n# Address issues as they are discovered by unscripted testers\n# Close the sub-task once all unscripted testers have given their +1 and the code has been finalized\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Unscripted Testing sub-task exist\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid? Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n* Has a +1 comment been provided by someone other than the sub-task assignee?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Unscripted Testing Sent");

    addSubTask({
      "fields":{
        "project":{
          "key": project
        },
        "parent":{
          "key": jiraKey
        },
        "summary":"Validation Testing",
        "description":"h2. Overview\nOnce the code for a project has reached a location where validation testing can be performed, update the status of this sub-task to _In Progress_.  Run any validation tests necessary to cover the modifications made in this Story / Defect.  If an issue is discovered, update the status of the sub-task to 'Blocked' and log a [CERTMPAGES|https://jira.cerner.com/projects/CERTMPAGES] issue providing details on how to recreate it.  Be sure to link to the CERTMPAGES issue from this sub-task.  Once all validation testing has completed successfully and all CERTMPAGE issues are addressed, close this sub-task.\n\nh2. Acceptance Criteria\n# Update the status of this sub-task to _In Progress_\n# Run any validation tests which cover the functionality for the project\n# If issues are discovered, log a CERTMPAGES issue and link to it from this sub-task\n# Once all tests are run successfully and all CERTMPAGES issues are addressed, close this sub-task\n\nh2. Audits Performed\n*Parent Issue Audits*\n* Does the Validation Testing sub-task exist?\n\n*Sub-Task Audits*\n* Has the sub-task been closed?\n* Has a resolution been given that no work is needed on the sub-task (_Not Applicable_, _Duplicate_, etc...) and is it valid?  Valid scenarios are detailed below.\n** The parent issue also has a resolution that no work is needed.\n** A white box test plan has been developed, posted for review and executed under the Gray Box /  Formal White Box Testing sub-task.\n* If any CERTMPAGES issues are linked, are they closed?",
        "assignee":{
          "name": Ta
        },
        "issuetype":{
          "name":"Sub-task"
        }
      }
    }
    );
    console.log("Validation Testing Sent");
  };

  /**WINTXTSUP and WINNETSUP Stories/Defects SC-Y Button - Sub-Tasks Created */
  document.getElementById('scYesWIN').onclick = () => {
    var Po = document.getElementById('POs').value;
    var Ta = document.getElementById('TAs').value;
    var Se = document.getElementById('SEs').value;
    var Tl = document.getElementById('TLs').value;
    console.log("PO: "+Po);
    console.log("TA: "+Ta);
    console.log("SE: "+Se);
    console.log("TL: "+Tl);
    document.getElementById('loader').style.display = "block";

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Define Requirements",
    //     "description":"h2. Overview\nWork with strategists, stakeholders and the development team to define requirements for this project. Once ready for review, attach the requirements documentation to the sub-task and request reviewers by @mentioning them. Once posted for review update the status of the sub-task to _In Review_.\n\nh2. Acceptance Criteria\n # Post the completed Project Requirement for Jazz review\n # Address comments as they are provided by reviewers\n # Close the sub-task once reviewers have given their +1 and requirements have been finalized",
    //     "assignee":{
    //       "name": Po
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Define Requirements request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Perform Hazard Analysis",
    //     "description":"h2. Overview\nWork with the Agile team to determine if the story impacts any of the following Hazards. Reference our current wiki page for our existing <Hazard Analysis document link>.\nh2. Acceptance Criteria:\n* Document with a Yes or No if your story impacts any of the following hazard types. If yes, explain why.\n** Financial: <yes or no. If yes, explain why>\n** Legal/Regulatory: <yes or no. If yes, explain why>\n** Data Integrity: <yes or no. If yes, explain why>\n** Patient Safety: <yes or no. If yes, explain why>\n** CyberSecurity/Information Security: <yes or no. If yes, explain why>\n* Engineer assigned to the project has added a +1 indicating that they discussed the impact this story has with regard to Hazards and agrees with the assessment.",
    //     "assignee":{
    //       "name": Po
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Perform Hazard Analysis request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Technical Design Document",
    //     "description":"h2. Overview\nCreate a technical design document outlining your proposed changes for this story. When writing your technical design document you can utilize either the [Microsoft Word Technical Design Template|https://wiki.cerner.com/display/public/IPDevConDoc/MPages+Platform+Development+Technical+Design+Template] or in the [wiki|https://wiki.cerner.com/display/public/IPDevConDoc/MPages+Platform+Development+Technical+Design+Template]. Once posted for review, update the status of the sub-task to {_}In Review{_}. Once all reviews are completed and the technical design document has been finalized, close the sub-task.\nh2. Acceptance Criteria\n# Write the technical design document outlining your proposed changes.\n# Write the Root cause Analysis in both the wiki and Root Cause Tab\n# If using the [wiki|https://wiki.cerner.com/display/public/IPDevConDoc/MPages+Platform+Development+Technical+Design+Template]\n## Attach the completed document wiki link to this sub-task for review\n## Address comments as they are provided by reviewers \n# Close the sub-task once all reviewers have completed their reviews and the technical design document has been finalized\n",
    //     "assignee":{
    //       "name": Se
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Technical Design Document request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Code Development",
    //     "description":"h2. Overview\nAs you work through the implementation of this project, create code reviews for any artifacts you've made modifications to. Reviews can be held in either Crucible or GitHub and should be linked to from this sub-task using a{_}Web Link{_}. Once you've posted code for review, update the status of this sub-task to{_}In Review{_}. Once you've made all necessary changes and closed/merged your reviews, close the sub-task.\nh2. Acceptance Criteria\n# Implement the change needed for the Story / Defect\n# Create code reviews and pull requests so others can review your work\n# Update the status of this sub-task to_In Review_\n# Address comments as they are provided and post additional commits as necessary\n# Close / Merge reviews as they are completed\n# Close this sub-task once all reviews are completed\n",
    //     "assignee":{
    //       "name": Se
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Code Development request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Unit and White Box Testing",
    //     "description":"h2. Overview\nWrite any necessary unit tests for code being introduced or altered which cover all logic paths and boundary conditions. If time permits, perform additional unit testing on existing code which is not currently covered. Once you've completed unit testing, create a pull request to review the updates and add a _Web Link_ to it in this sub-task. Be sure to attach the evidence ZIP file of a successful unit test run and code coverage to the pull request. Once posted for review update the status of the sub-task to In {_}Review{_}.\nh2. Acceptance Criteria\n# Write the unit tests which cover all logic paths and boundary conditions for any code being introduced or altered\n# Create a pull request in the necessary repository and add a _Web Link_ to it in this sub-task\n# Address comments as they are provided by reviewers\n# Merge your pull request\n# Close the sub-task",
    //     "assignee":{
    //       "name": Se
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Unit and White Box Testing request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Test Case Design and Test Case Tracing",
    //     "description":"h2. Overview\nOnce test plans have been created, reviewed and uploaded to the appropriate location, update all requirements pages with links to the test plans that cover the listed requirement for this project. Once completed, add _Web Links_ to this sub-task linking out to the requirements documents that were updated.\nTest plan tracing should be completed for the following test types:\n* Manual Vertical Regression Test Plans\n* Manual SBET Test Plans\n* Manual UI Test Plans\nh2. Acceptance Criteria\n# Create a manual test case  to complete the review\n# Identify test plan designs that need to be modified or created\n# Add _Web Links_ to each page that is being updated\n** If no updates were necessary, add _Web Links_ to the existing test plan designs which cover the functionality of this project\n# Close the sub-task once reviewers have given their +1 and the test plan designs have been finalized\n** If no updates were necessary, reviewers will be giving a +1 that all functionality is covered in the existing pages\n# Update all requirements wikis with links to the test plans that cover the requirements listed for this project.\n# Add a _Web Link_ to this sub-task for each requirements page updated. Close the Subtask\n",
    //     "assignee":{
    //       "name": Ta
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Test Case Design and Test Case Tracing request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Automate Test Case",
    //     "description":"h2. Overview\nMultiple types of testing may need to be created to cover all of the changes for this Story / Defect. Follow the guidance below to determine what steps should be taken based on the test type.\n*Automated Test Plans*\nIf creating automated test plans, perform the code changes and create a pull request for each test being modified. For each pull request add a _Web Link_ to it in this sub-task. Update the status of the sub-task to {_}In Review{_}. Once all reviews are merged, close the sub-task\nh2. Acceptance Criteria\n*Automated Test Plans*\n# Write the automated tests(Eggplant/ Touchstone) which cover the changes being made in this story\n# Create a pull request in the necessary repositories and add _Web Links_ to them in this sub-task\n# Address comments as they are provided by reviewers\n# Merge your pull requests\n# Close the sub-task",
    //     "assignee":{
    //       "name": Ta
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Automate Test Case request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Certification Guidelines and Techwriter request",
    //     "description":"h2. Overview\nFor client-viewable solution changes, a certification guideline detailing how clients will test enhancements/defects is needed. Create the appropriate document outlining the necessary steps for client testing. Once ready for review, attach the certification guideline to the sub-task and request reviewers by @mentioning them. Once posted for review update the status of the sub-task to _In Review_ Acceptance Criteria.\nPrior to delivering projects to clients, we must ensure all of our documentation is complete and accurate. We employ the assistance of Technical Writers to help us with this. If any of the following documents are being created or modified a [PRODOC|https://jira.cerner.com/projects/PRODOC] issue should be logged so they can be reviewed by a Technical Writer.\n* Certification Guideline\n* Reference Pages\n* Help Pages\nh2. Acceptance Criteria\n# Write the certification guideline testing steps\n# Attach the completed document to this sub-task for review\n# Address comments as they are provided by reviewers\n# Close the sub-task once reviewers have given their +1 and the certification guideline has been finalized\n# Create the PRODOC JIRA issue. Attach any certification guideline documents for review\n# Add _Web Link_ links to any reference or help pages that have been created or modified\n# Link to the created PRODOC issue from this sub-task using the _JIRA Issue_ link type\n** Be sure to select _JIRA_ from the _Server_ drop-down selection\n# Close this sub-task",
    //     "assignee":{
    //       "name": Po
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Certification Guidelines and Techwriter request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Complete Design IO Form",
    //     "description":"h2. Overview\nWhen finishing up a project we must document certain steps of the software development process to abide by federal regulations. In order to do this we create and fill out a Design Input / Output form with project identifiers, links to locations where work has been completed and any other materials which show a development process was followed. Ensure the following information is provided in the Design Input / Output Issue:\n*General Tab*\n* Solution\n* Solution Details\n* JIRA Group\n* Project identifiers\n*Design Input Tab*\n* Requirements: Provide links to the 'Define Requirements' sub-tasks for this project* Project Traceability: Provide links to the 'Define Requirements' sub-tasks for this project since they provide direct access to the requirements and/or hazards that apply to the project.\n*Design Output Tab*\n* Technical Design Document: Provide links to any technical design document reviews for the project\n* Source Code: Provide links to any code reviews for the project\nAdditionally, you should check the Approvals tab to make sure all signatures have been gathered.\nh2. Acceptance Criteria\n# Ensure this project has an associated Design IO form\n** The Design IO form should be linked in the parent Story / Defect or possibly in an ancestral Epic.\n# Check that all of the Design IO tabs are filled our appropriately\n# Ensure all signatures have been collected\n# Close this sub-task once all details have been documented for this Story / Defect\n",
    //     "assignee":{
    //       "name": Po
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Complete Design IO Form request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Unscripted Testing",
    //     "description":"h2. Overview\nUnscripted testing should be completed at the same time as code reviews are being performed. This will allow your team to identify issues when code is still being actively developed. It is the responsibility of the Engineer to setup a location where their changes can be easily tested by other associates. Once setup is complete, details on how to access the testing environment should be provided in this sub-task. When you are ready for unscripted testing to begin, @mention the associates you would like to assist you with testing. Any issues identified should be addressed and re-deployed back out to the testing environment. Once all testers have completed their unscripted testing, they should leave a +1 comment on this sub-task to signify that they were able to test successfully.\n*Considerations*\n# If there is an equivalent workflow in Win64, be sure to include testing the equivalent steps/UI with unscripted testing.\n# Include all relevant associates in the unscripted testing session (up to and including subject-matter experts, strategists, UX designers, solution designers, and so on.\nh2. Acceptance Criteria\n# Setup a location where testing can take place\n# Detail any information needed by testers in this sub-task\n# Address issues as they are discovered by unscripted testers\n# Close the sub-task once all unscripted testers have given their +1 and the code has been finalized\n",
    //     "assignee":{
    //       "name": Ta
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Unscripted Testing request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Validation Testing",
    //     "description":"h2. Overview\nOnce the code for a project has reached a location where validation testing can be performed, update the status of this sub-task to {_}In Progress{_}. Run any validation tests necessary to cover the modifications made in this Story / Defect. Once all validation testing has been completed successfully. close this sub-task.\nh2. Acceptance Criteria\n# Update the status of this sub-task to _In Progress_\n# Run any validation tests which cover the functionality of the project.\n# Attach the Test plan and Test execution record link for the project and get +1 for the peer review.\n# Once all tests are run successfully. close this sub-task.\n",
    //     "assignee":{
    //       "name": Ta
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Validation Testing request sent");

    // addSubTask({
    //   "fields":{
    //     "project":{
    //       "key": project
    //     },
    //     "parent":{
    //       "key": jiraKey
    //     },
    //     "summary":"Story Review or Merge Code",
    //     "description":"h2. Overview\nThe team lead should perform an evaluation of the story to ensure all work was completed as per the Powerchart framework development process and all evidence created when executing that process is discoverable. Once confirmed, merge any features which are ready for validation testing. Once all features have merged, close this sub-task.\nh2. Acceptance Criteria\n# Evaluate the story to ensure the Powerchart development process was followed and all evidence is discoverable\n# Merge any features associated with this Story / Defect\n# Close this sub-task",
    //     "assignee":{
    //       "name": Tl
    //     },
    //     "issuetype":{
    //       "name":"Sub-task"
    //     }
    //   }
    // }
    // );
    // console.log("Story Review or Merge Code request sent");

  };

  document.getElementById("options").onclick = () =>{
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  };
}

