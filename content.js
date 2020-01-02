// Phone groups
const kPhoneGroups = [
    ["review.enrolleeInfo", "contactAddressPhone"],
    ["enrollee.employmentInfo", "employmentPhone"],
    ["travel.poc", "usContact"],
    ["travel.emergencyInfo", "emergencyPhone"]
]
// Within each phone group telephone text should be parsed into
// phone_number
// phone_cc
// For example, 
// CHINA (CHN) (+86) 1234567890
// should be parsed into
// phone_cc = CHINA (CHN) (+86)
// phone_number = 1234567890
const kParseTelephone = "__PARSE_TELEPHONE__";
const kPhoneType = "phone_type";
const kPhoneCountryCode = "phone_cc";
const kPhoneNumber = "phone_number";
// Each element consists of at least two fields.
// The first one is the "translate" attributes found on the html tags
// on the review application page to identify data fields.
// The second and beyond are the "id" attributes on the application form.
// One special case is kParseTelephone which means the text should
// be further parsed into country code and phone number.
const kKeywords = [
    // ["review.travel",],
    ["review.lastname", "surname"],
    ["review.firstname", "givenName"],
    ["document.dob", "dob"],
    // ["review.visa",],
    ["document.haveVisa", "haveVisa"],
    ["review.foilNumber", "visaFoil"],
    // ["document.currentPassport",],
    ["review.passportNbr", "passportNumber"],
    ["review.passportCountry", "passIssueCountry"],
    ["document.passportIssueDate", "passIssue"],
    ["document.passportExpirationDate", "passExpiration"],
    ["document.passportContainsVisa", "havePrimaryPassport"],
    // TODO: visa on a different passport
    // ["", "primaryPassNum"],
    // ["", "primaryPassCOI"],
    // ["", "primaryPassIssue"],
    // ["", "primaryPassExp"],
    // ["", "primaryPassSurname"],
    // ["", "primaryPassGivenName"],
    // ["", "primaryPassDOB"],
    // ["review.enrolleeinformation",],
    // ["review.enrolleeInfo",],
    ["review.native.lastname", "surnameNative"],
    ["review.native.firstname", "givenNameNative"],
    ["review.gender", "gender"],
    // ["sex.female",],
    ["review.birthCity", "birthCity"],
    ["review.birthCountry", "birthCountry"],
    ["review.citizenshipCountry", "citizenshipCountry"],
    ["review.nationalNumber", "nationalID"],
    ["review.address.1", "homeAddr_line1"],
    ["review.address.2", "homeAddr_line2"],
    ["review.apartment", "homeAddr_apt"],
    ["review.city", "homeAddr_city"],
    ["review.state", "homeAddr_state"],
    ["review.country", "homeAddr_country"],
    ["review.native.address", "addressNative"],
    ["review.email", "contactEmailAddress", "contactEmailConfirm"],
    ["review.secondaryEmail", "contactEmailAddress2", "contactEmailConfirm2"],
    ["review.telephoneType", kPhoneType],
    ["review.telephone", kParseTelephone],
    // ["enrollee.aliases",],
    ["enrollee.question.1", "haveAlias"],  // no
    // ["enrollee.otherCitizenship",],
    ["enrollee.question.3", "haveMultipleCitizenship"],  // no
    ["enrollee.question.5", "havePrevCitizenship"],  // no
    ["enrollee.question.2", "haveOtherDoc"],  // no
    // ["enrollee.membership",],
    ["enrollee.question.6", "haveGEMembership"],  // no
    // ["enrollee.parents",],
    ["review.lastname", "familyNameParent1"],
    ["review.givenname", "givenNameParent1"],
    ["review.native.parentName", "parent1Native"],
    ["review.lastname", "familyNameParent2"],
    ["review.givenname", "givenNameParent2"],
    ["review.native.parentName", "nameParentNative2"],
    // ["enrollee.employmentInfo",],
    ["enrollee.question.7", "haveEmployer"],
    ["review.jobTitle", "employmentTitle"],
    ["review.employerName", "employmentName"],
    ["review.native.employerName", "employerNameNative"],
    ["review.workAddress.1", "employmentAddr_line1"],
    ["review.workAddress.2", "employmentAddr_line2"],
    ["review.city", "employmentAddr_city"],
    ["review.state", "employmentAddr_state"],
    ["review.country", "employmentAddr_country"],
    ["review.telephone", kParseTelephone],
    // ["review.travelinformation",],
    // transit no
    // ["travel.poc",],
    ["review.name", "usContactName"],
    ["review.workAddress.1", "usContactAddr_line1"],
    ["review.workAddress.2", "usContactAddr_line2"],
    ["review.apartment", "usContactAddr_apt"],
    ["review.city", "usContactAddr_city"],
    ["review.state.us", "usContactAddr_state"],
    ["review.phone", kParseTelephone],
    // ["travel.address",],
    ["review.workAddress.1", "usAddr_line1"],
    ["review.workAddress.2", "usAddr_line2"],
    ["review.apartment", "usAddr_apt"],
    ["review.city", "usAddr_city"],
    ["review.state.us", "usAddr_state"],
    // ["travel.emergencyInfo",],
    ["review.lastname", "emergencyFamilyName"],
    ["review.givenname", "emergencyGivenName"],
    ["review.email", "emergencyEmail"],
    ["review.telephone", kParseTelephone],
    // ["application.eligibilityQuestions",],
    // ["eligibility.1",],
    // ["eligibility.2",],
    // ["eligibility.3",],
    // ["eligibility.4",],
    // ["eligibility.5",],
    // ["eligibility.6",],
    // ["eligibility.7",],
    // ["eligibility.8",],
    // ["eligibility.9.v2",]
];

const kDefaultData = {
    "transit": "No",
    "question1": "No",
    "question2": "No",
    "question3": "No",
    "question4": "No",
    "question5": "No",
    "question6": "No",
    "question7": "No",
    "question8": "No",
    "question9": "No",
}

const kGreen = "#28a745";

function readRecord(fullName, callback) {
    chrome.storage.sync.get(fullName, function (data) {
        callback(JSON.parse(data[fullName]));
    });
}

function addRecord(fullName, data, callback) {
    let save = {};
    save[fullName] = JSON.stringify(data);
    chrome.storage.sync.set(save, function () {
        console.log(`${fullName} saved!`);
        callback();
    });
}

// Parse the following page and import data to storage.
// https://www.evus.gov/print.html#/reviewApplication/?lang=en
function importData() {
    let keywords = kKeywords.slice();
    let phoneGroups = kPhoneGroups.slice();
    let record = false;
    let data = {};
    $("h2,h4,div,span").each(function (index, elem) {
        if (record) {
            let value = $(elem).html().replace(/<.*?>/g, "").trim();
            if (keywords[0][1] === kPhoneType) {
                !(phoneGroup in data) && (data[phoneGroup] = {});
                data[phoneGroup][kPhoneType] = value;
            } else if (keywords[0][1] === kParseTelephone) {
                // Process phone number
                const lastSpaceIndex = value.lastIndexOf(" ");
                !(phoneGroup in data) && (data[phoneGroup] = {});
                data[phoneGroup][kPhoneCountryCode] = value.slice(0, lastSpaceIndex);
                data[phoneGroup][kPhoneNumber] = value.slice(lastSpaceIndex + 1);
            } else {
                for (let key of keywords[0].slice(1)) {
                    data[key] = value;
                }
            }
            // Highlight imported fields
            $(elem).css("background-color", kGreen);
            $(elem).css("color", "white");
            keywords.shift();
            if (keywords.length == 0) {
                return false;
            }
            record = false;
        }
        if (elem.hasAttribute("translate")) {
            let key = $(elem).attr("translate");
            if (key === keywords[0][0]) {
                record = true;
            }
            if (phoneGroups.length > 0 && key === phoneGroups[0][0]) {
                phoneGroup = phoneGroups[0][1];
                phoneGroups.shift();
            }
        }
    });
    if (!data.surname || !data.givenName) {
        alert("Failed to import data! Make sure you are on \n"
            + "https://www.evus.gov/print.html#/reviewApplication.");
        return;
    }
    const fullName = data.surname + "," + data.givenName;
    addRecord(fullName, data, function () {
        chrome.runtime.sendMessage({ cmd: "refresh" });
    });
}

// <select id="sss">
//   <option value="abc">ABC</option>
//   <option value="def">DEF</option>
// <select>
// "id" is the id attribute on the select tag
// "text" is the display text in the option, e.g., ABC, DEF
// Returns the corresponding value attribute, e.g., abc, def
// "id" is ignored since it doesn't work sometimes
function getValueByText(id, text) {
    let value = null;
    text = text.toLowerCase();
    $("option").each(function (index, elem) {
        if ($(elem).html().toLowerCase() === text) {
            value = $(elem).val();
            return false;
        }
    });
    return value;
}

// Trigger form validation
// jQuery does not work $("#abc").trigger("input")
function triggerChange(node) {
    node.dispatchEvent(new Event("focus"));
    node.dispatchEvent(new Event("change"));
    node.style.setProperty("background-color", kGreen);
    node.style.setProperty("color", "white");
    // console.log(node.id + " " + node.value);

}

function doFillForm(fullName) {
    readRecord(fullName, function (data) {
        const allData = { ...kDefaultData, ...data };
        for (let [k, v] of Object.entries(allData)) {
            let input = document.getElementById(k);
            if (input) {
                if (input.nodeName === "SELECT") {
                    input.value = getValueByText(k, v);
                } else if (input.nodeName === "INPUT") {
                    input.value = v.toUpperCase();
                } else {
                    continue;
                }
                triggerChange(input);
            }
        }
        // phone numbers
        for (const phoneGroupPair of kPhoneGroups) {
            const phoneGroup = phoneGroupPair[1];
            $("select,input", $("phone#" + phoneGroup)).each(function (i, elem) {
                if (elem.id.includes(kPhoneType) && kPhoneType in data[phoneGroup]) {
                    elem.value = getValueByText(elem.id, data[phoneGroup][kPhoneType]);
                } else if (elem.id.includes(kPhoneCountryCode)) {
                    elem.value = getValueByText(elem.id, data[phoneGroup][kPhoneCountryCode]);
                } else if (elem.id.includes(kPhoneNumber)) {
                    elem.value = data[phoneGroup][kPhoneNumber];
                } else {
                    return;
                }
                let input = document.getElementById(elem.id);
                triggerChange(input);
            });
        }
    });
}

// Fill twice because updating "country" (from empty to some value)
// clears "state".
function fillForm(fullName) {
    doFillForm(fullName);
    doFillForm(fullName);
}

console.log("content scritp loaded!");