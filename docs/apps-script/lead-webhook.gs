/**
 * Flyriise Aviation — enquiry delivery to Gmail
 * ---------------------------------------------------------------------------
 * A Google Apps Script web app that receives the validated lead JSON from
 * /api/lead, appends it to a spreadsheet and emails it to admissions.
 *
 * SETUP (about five minutes, no cost, no API key)
 *   1. Create a Google Sheet named "Flyriise leads" in the institute's account.
 *   2. In that sheet: Extensions > Apps Script. Delete the sample code and
 *      paste this file.
 *   3. Set NOTIFY_TO below to the inbox that should receive enquiries.
 *   4. Deploy > New deployment > Web app
 *        Description:      Website enquiries
 *        Execute as:       Me
 *        Who has access:   Anyone
 *      Authorise the script when prompted.
 *   5. Copy the deployment's /exec URL and set it as LEAD_SINK_URL in the
 *      site's environment variables.
 *
 * NOTES
 *   - Every submission is written to the sheet AND emailed, so a mail failure
 *     never loses an enquiry.
 *   - Free Gmail accounts can send to 100 recipients per day. This site will
 *     not approach that; if it ever does, move to Google Workspace (1,500/day).
 *   - After editing this file, deploy a NEW VERSION, or the live URL keeps
 *     serving the old code.
 *   - "Who has access: Anyone" means anyone holding the URL can post to it.
 *     Keep the URL server-side (it belongs in env vars, never in page source).
 */

var NOTIFY_TO = "ADMISSIONS_EMAIL_HERE";
var SUBJECT_PREFIX = "Website enquiry";
var SHEET_NAME = "Leads";

var HEADERS = [
  "Reference",
  "Received",
  "Type",
  "Name",
  "Phone",
  "Email",
  "Programme",
  "City",
  "Message",
  "Qualification",
  "Preferred start"
];

/** Opening the /exec URL in a browser confirms the deployment is live. */
function doGet() {
  return ContentService.createTextOutput("Flyriise lead endpoint is running.");
}

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return reply_({ ok: false, error: "Empty body" });
  }

  var lead;
  try {
    lead = JSON.parse(e.postData.contents);
  } catch (error) {
    return reply_({ ok: false, error: "Body was not JSON" });
  }

  var reference = lead.id || "UNKNOWN";

  // Sheet first, so a mail outage still leaves a record.
  try {
    appendRow_(lead);
  } catch (error) {
    // Deliberately continue: the email is the primary channel.
  }

  try {
    MailApp.sendEmail(mailOptions_(lead, reference));
  } catch (error) {
    return reply_({ ok: false, error: "Mail failed" });
  }

  return reply_({ ok: true, reference: reference });
}

function mailOptions_(lead, reference) {
  var options = {
    to: NOTIFY_TO,
    subject: SUBJECT_PREFIX + " — " + (lead.fullName || "no name") + " (" + reference + ")",
    body: bodyFor_(lead)
  };
  if (lead.email) options.replyTo = lead.email;
  return options;
}

function bodyFor_(lead) {
  var lines = [
    "New " + (lead.kind || "enquiry") + " from the website.",
    "",
    "Reference:       " + (lead.id || "—"),
    "Received:        " + (lead.receivedAt || "—"),
    "Name:            " + (lead.fullName || "—"),
    "Phone:           " + (lead.phone || "—"),
    "Email:           " + (lead.email || "—"),
    "Programme:       " + (lead.programSlug || "—"),
    "City:            " + (lead.location || "—"),
    "Qualification:   " + (lead.highestQualification || "—"),
    "Preferred start: " + (lead.preferredStart || "—"),
    "",
    "Message:",
    lead.message || "(none)",
    "",
    "Reply to this email to reach the candidate directly."
  ];
  return lines.join("\n");
}

function appendRow_(lead) {
  var sheet = sheet_();
  sheet.appendRow([
    lead.id || "",
    lead.receivedAt || "",
    lead.kind || "",
    lead.fullName || "",
    lead.phone || "",
    lead.email || "",
    lead.programSlug || "",
    lead.location || "",
    lead.message || "",
    lead.highestQualification || "",
    lead.preferredStart || ""
  ]);
}

function sheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) {
    throw new Error("This script must be bound to a spreadsheet.");
  }
  var sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function reply_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
