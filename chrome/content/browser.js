/* ***** BEGIN LICENCE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public Licence Version
 * 1.1 (the "Licence"); you may not use this file except in compliance with
 * the Licence. You may obtain a copy of the Licence at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the Licence
 * for the specific language governing rights and limitations under the
 * Licence.
 *
 * The Original Code is LeechBlock Add-on for Firefox.
 *
 * The Initial Developer of the Original Code is James Anderson.
 * Portions created by the Initial Developer are Copyright (C) 2007-2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public Licence Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public Licence Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENCE BLOCK ***** */

/*
 * This file contains the code for handling browser-based events.
 */

// Array of flags to keep track of which block sets have had warnings displayed
var LeechBlock_doneWarning = [false, false, false, false, false, false];

var TempAllow = false;
var TempURL = '';

// Create progress listener for detecting location change
var LeechBlock_progressListener = {
	QueryInterface: function(aIID) {
		if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
				aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
				aIID.equals(Components.interfaces.nsISupports)) {
			return this;
		}
		throw Components.results.NS_NOINTERFACE;
	},

	onLocationChange: function(aProgress, aRequest, aURI) {
		LeechBlock_onLocationChange(aProgress.DOMWindow);
	},

	onStateChange: function() {},
	onProgressChange: function() {},
	onStatusChange: function() {},
	onSecurityChange: function() {},
	onLinkIconAvailable: function() {}
};

// Handles browser loading
//
function LeechBlock_onLoad(event) {
	// Transfer password from preferences to Login Manager if necessary
	try {
		var password = LeechBlock_getCharPref("password");
		LeechBlock_storePassword(password);
		LeechBlock_clearUserPref("password");
	} catch (e) {
		// Nothing to do
	}

	// Add progress listener for this browser instance
	gBrowser.addProgressListener(LeechBlock_progressListener,
			Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);

	// Apply preference for show/hide context menu
	var hcm = LeechBlock_getBoolPref("hcm");
	document.getElementById("lb-context-menu").hidden = hcm;

	// Get current time in seconds
	var now = Math.floor(Date.now() / 1000);

	for (var set = 1; set <= 6; set++) {
		// Reset time data if currently invalid
		var timedata = LeechBlock_getCharPref("timedata" + set).split(",");
		if (timedata.length == 4) {
			timedata[5] = 0; // add lockdown end time (null)
		} else if (timedata.length != 5) {
			timedata = [now, 0, 0, 0, 0];
		}
		LeechBlock_setCharPref("timedata" + set, timedata.join(","));
	}

	// Get UTC timestamp in milliseconds
	var timestamp = Date.now();

	// Create HTTP request for sites for block set 1
	var sitesURL1 = LeechBlock_getCharPref("sitesURL1")
			.replace(/\$S/, "1").replace(/\$T/, timestamp);
	if (sitesURL1 != "") {
		try {
			var req1 = new XMLHttpRequest();
			req1.set = 1;
			req1.open("GET", sitesURL1, true);
			req1.onreadystatechange = function () {
				LeechBlock_httpRequestCallback(req1);
			};
			req1.send(null);
		} catch (e) {
			LeechBlock_printConsole("Cannot load sites from URL: " + sitesURL1);
		}
	}

	// Create HTTP request for sites for block set 2
	var sitesURL2 = LeechBlock_getCharPref("sitesURL2")
			.replace(/\$S/, "2").replace(/\$T/, timestamp);
	if (sitesURL2 != "") {
		try {
			var req2 = new XMLHttpRequest();
			req2.set = 2;
			req2.open("GET", sitesURL2, true);
			req2.onreadystatechange = function () {
				LeechBlock_httpRequestCallback(req2);
			};
			req2.send(null);
		} catch (e) {
			LeechBlock_printConsole("Cannot load sites from URL: " + sitesURL2);
		}
	}

	// Create HTTP request for sites for block set 3
	var sitesURL3 = LeechBlock_getCharPref("sitesURL3")
			.replace(/\$S/, "3").replace(/\$T/, timestamp);
	if (sitesURL3 != "") {
		try {
			var req3 = new XMLHttpRequest();
			req3.set = 3;
			req3.open("GET", sitesURL3, true);
			req3.onreadystatechange = function () {
				LeechBlock_httpRequestCallback(req3);
			};
			req3.send(null);
		} catch (e) {
			LeechBlock_printConsole("Cannot load sites from URL: " + sitesURL3);
		}
	}

	// Create HTTP request for sites for block set 4
	var sitesURL4 = LeechBlock_getCharPref("sitesURL4")
			.replace(/\$S/, "4").replace(/\$T/, timestamp);
	if (sitesURL4 != "") {
		try {
			var req4 = new XMLHttpRequest();
			req4.set = 4;
			req4.open("GET", sitesURL4, true);
			req4.onreadystatechange = function () {
				LeechBlock_httpRequestCallback(req4);
			};
			req4.send(null);
		} catch (e) {
			LeechBlock_printConsole("Cannot load sites from URL: " + sitesURL4);
		}
	}

	// Create HTTP request for sites for block set 5
	var sitesURL5 = LeechBlock_getCharPref("sitesURL5")
			.replace(/\$S/, "5").replace(/\$T/, timestamp);
	if (sitesURL5 != "") {
		try {
			var req5 = new XMLHttpRequest();
			req5.set = 5;
			req5.open("GET", sitesURL5, true);
			req5.onreadystatechange = function () {
				LeechBlock_httpRequestCallback(req5);
			};
			req5.send(null);
		} catch (e) {
			LeechBlock_printConsole("Cannot load sites from URL: " + sitesURL5);
		}
	}

	// Create HTTP request for sites for block set 6
	var sitesURL6 = LeechBlock_getCharPref("sitesURL6")
			.replace(/\$S/, "6").replace(/\$T/, timestamp);
	if (sitesURL6 != "") {
		try {
			var req6 = new XMLHttpRequest();
			req6.set = 6;
			req6.open("GET", sitesURL6, true);
			req6.onreadystatechange = function () {
				LeechBlock_httpRequestCallback(req6);
			};
			req6.send(null);
		} catch (e) {
			LeechBlock_printConsole("Cannot load sites from URL: " + sitesURL6);
		}
	}
}

// Handles browser unloading
//
function LeechBlock_onUnload(event) {
	// Remove progress listener for this browser instance
	gBrowser.removeProgressListener(LeechBlock_progressListener);
}

// Handles HTTP request callback
//
function LeechBlock_httpRequestCallback(req) {
	if (req.readyState == 4 && req.status == 200) {
		// Get sites from response text
		var sites = req.responseText.replace(/\s+/g, " ")
				.replace(/(^ +)|( +$)|(\w+:\/+)/g, "");

		// Get regular expressions to match sites
		var regexps = LeechBlock_getRegExpSites(sites);

		// Update preferences
		LeechBlock_setCharPref("sites" + req.set, sites);
		LeechBlock_setCharPref("blockRE" + req.set, regexps.block);
		LeechBlock_setCharPref("allowRE" + req.set, regexps.allow);
	}
}

// Handles location changing
//
function LeechBlock_onLocationChange(win) {
	//LeechBlock_printConsole("location: " + win.location + " " + win);

	// Get URL for this page
	var pageURL = LeechBlock_trimURL(win.location.href);

	// Only check page the first time (i.e. no check when tab re-activated)
	if (win.lbPageURL != pageURL) {
		win.lbPageURL = pageURL;
		LeechBlock_checkBlock(pageURL, win, false);
	}

	LeechBlock_updateTimeLeft(win.lbSecsLeft);
}

// Handles page loading
//
function LeechBlock_onPageLoad(event) {
	LeechBlock_printConsole("doc.load: " + event.target.location + " " + event.target);
	LeechBlock_printConsole("TempAllow = " + TempAllow);
  LeechBlock_printConsole("Setting TempAllow to false");

  TempAllow = false;
  //TempURL = '';

	var doc = event.target;
	var win = doc.defaultView;

	// Get URL for this page
	var pageURL = LeechBlock_trimURL(win.location.href);
	LeechBlock_printConsole("LeechBlock_onPageLoad : pageURL = " + pageURL);
	LeechBlock_printConsole("LeechBlock_onPageLoad : TempURL = " + TempURL);

	// If this is default block page then insert URL of blocked (previous) page
	if (pageURL == LeechBlock_DEFAULT_BLOCK_URL) {
		var hashURL = win.location.hash.substring(1);
		var blockedURL = doc.getElementById("blockedURL");
		if (blockedURL != null) {
			if (hashURL.length > 80) {
				blockedURL.innerHTML = hashURL.substring(0, 77) + "...";
			} else {
				blockedURL.innerHTML = hashURL;
			}
		}
		TempAllow = true;
    TempURL = hashURL;
    LeechBlock_printConsole("Setting TempAllow to true");

		var var_enter = doc.getElementById("ID_enter");
		if (var_enter != null) {
			var_enter.setAttribute("href", hashURL);
		}
		var ID_leave = doc.getElementById("ID_leave");
		if (ID_leave != null) {
			ID_leave.setAttribute("href", 'chrome://leechblock/locale/leave.html');
		}
		var ID_allow = doc.getElementById("ID_allow");
		if (ID_allow != null) {
			ID_allow.setAttribute("href", 'chrome://leechblock/locale/allow.html');
		}
		var ID_ban = doc.getElementById("ID_ban");
		if (ID_ban != null) {
			ID_ban.setAttribute("href", 'chrome://leechblock/locale/ban.html');
		}
	}

	// Start clocking time spent on this page
	var focus = (document.commandDispatcher.focusedWindow == win);
	LeechBlock_clockPageTime(doc, true, focus);

	doc.addEventListener("pagehide", LeechBlock_onPageUnload, false);
	doc.addEventListener("focus", LeechBlock_onPageFocus, false);
	doc.addEventListener("blur", LeechBlock_onPageBlur, false);
	//win.addEventListener("focus", LeechBlock_onWinFocus, false);
	//win.addEventListener("blur", LeechBlock_onWinBlur, false);

	// Only check page if not already checked on location change
	if (win.lbPageURL != pageURL) {
		win.lbPageURL = pageURL;
		LeechBlock_checkBlock(pageURL, win, false);
	}
}

// Checks the URL of a window and applies block if necessary
//
function LeechBlock_checkBlock(pageURL, win, isRepeat) {

	// Quick exit for non-http/non-file/non-about URLs
	if (!/^(http|file|about)/.test(pageURL)) {
		return;
	}

	// Quick exit for embedded pages (according to preference)
	if (win.frameElement != null && !LeechBlock_getBoolPref("bep")) {
		return;
	}

	// Get current time/date
	var timedate = new Date();

	// Get current time in seconds
	var now = Math.floor(Date.now() / 1000);

	win.lbSecsLeft = Infinity;

	for (var set = 1; set <= 6; set++) {
		// Get regular expressions for matching sites to block/allow
		var blockRE = LeechBlock_getCharPref("blockRE" + set);
		if (blockRE == "") continue; // no block for this set
		var allowRE = LeechBlock_getCharPref("allowRE" + set);

		// Get preference for active block
		var activeBlock = LeechBlock_getBoolPref("activeBlock" + set);

		// Get preferences for preventing access to about:addons and about:config
		var prevAddons = LeechBlock_getBoolPref("prevAddons" + set);
		var prevConfig = LeechBlock_getBoolPref("prevConfig" + set);

		// Test URL against block/allow regular expressions
		if (LeechBlock_testURL(pageURL, blockRE, allowRE)
				|| (prevAddons && /^about:addons/.test(pageURL))
				|| (prevConfig && /^about:config/.test(pageURL))) {
			// Get preferences for this set
			var timedata = LeechBlock_getCharPref("timedata" + set).split(",");
			var times = LeechBlock_getCharPref("times" + set);
			var minPeriods = LeechBlock_getMinPeriods(times);
			var limitMins = LeechBlock_getCharPref("limitMins" + set);
			var limitPeriod = LeechBlock_getCharPref("limitPeriod" + set);
			var periodStart = LeechBlock_getTimePeriodStart(now, limitPeriod);
			var conjMode = LeechBlock_getBoolPref("conjMode" + set);
			var daySel = LeechBlock_decodeDays(LeechBlock_getIntPref("days" + set));
			var blockURL = LeechBlock_getCharPref("blockURL" + set);

			if (win.lbRepeatCheckPending == undefined) {
				// Start timer for repeat check
				setTimeout(LeechBlock_repeatCheckBlock,
						LeechBlock_getIntPref("repeatCheckPeriod"),
						win, pageURL);
				win.lbRepeatCheckPending = true;
			}

			// Check day
			var onSelectedDay = daySel[timedate.getDay()];

			// Check time periods
			var secsLeftBeforePeriod = Infinity;
			if (onSelectedDay && times != "") {
				// Get number of minutes elapsed since midnight
				var mins = timedate.getHours() * 60 + timedate.getMinutes();

				// Check each time period in turn
				for (var i in minPeriods) {
					if (mins >= minPeriods[i].start
							&& mins < minPeriods[i].end) {
						secsLeftBeforePeriod = 0;
					} else if (mins < minPeriods[i].start) {
						// Compute exact seconds before this time period starts
						var secs = (minPeriods[i].start - mins) * 60
								- timedate.getSeconds();
						if (secs < secsLeftBeforePeriod) {
							secsLeftBeforePeriod = secs;
						}
					}
				}
			}

			// Check time limit
			var secsLeftBeforeLimit = Infinity;
			if (onSelectedDay && limitMins != "" && limitPeriod != "") {
				// Compute exact seconds before this time limit expires
				secsLeftBeforeLimit = limitMins * 60;
				if (timedata.length == 5 && timedata[2] == periodStart) {
					var secs = secsLeftBeforeLimit - timedata[3];
					secsLeftBeforeLimit = Math.max(0, secs);
				}
			}

			var withinTimePeriods = (secsLeftBeforePeriod == 0);
			var afterTimeLimit = (secsLeftBeforeLimit == 0);

			// Check lockdown condition
			var lockdown = (timedata.length == 5 && timedata[4] > now);

			// Determine whether this page should now be blocked
			var doBlock = lockdown
					|| (!conjMode && (withinTimePeriods || afterTimeLimit))
					|| (conjMode && (withinTimePeriods && afterTimeLimit));

			// Redirect page if all relevant block conditions are fulfilled
			if (doBlock && (!isRepeat || activeBlock) && !TempAllow ) {
				TempAllow = false;
        LeechBlock_printConsole("Setting TempAllow to false");

				// Get final URL for block page
				if (blockURL == LeechBlock_DEFAULT_BLOCK_URL) {
					blockURL = blockURL + "#" + pageURL;
				} else {
					blockURL = blockURL.replace(/\$U/, pageURL);
				}

				// Redirect page according to preference
				if (LeechBlock_getBoolPref("kpb")) {
					win.location = blockURL;
				} else {
					win.location.replace(blockURL);
				}

				return; // nothing more to do
			}

			// Update seconds left before block
			var secsLeft = conjMode
					? (secsLeftBeforePeriod + secsLeftBeforeLimit)
					: Math.min(secsLeftBeforePeriod, secsLeftBeforeLimit);
			if (secsLeft < win.lbSecsLeft) {
				win.lbSecsLeft = secsLeft;
				win.lbSecsLeftSet = set;
			}
		}
	}

	// Determine whether to display warning message
	var warnSecs = LeechBlock_getCharPref("warnSecs");
	if (warnSecs != "") {
		var set = win.lbSecsLeftSet;
		if (win.lbSecsLeft > warnSecs) {
			// Reset flag
			LeechBlock_doneWarning[set - 1] = false;
		} else if (!LeechBlock_doneWarning[set - 1]) {
			// Set flag
			LeechBlock_doneWarning[set - 1] = true;
			// Display warning message
			var setName = LeechBlock_getCharPref("setName" + set);
			LeechBlock_alertBlockWarning(set, setName, win.lbSecsLeft);
		}
	}
}

// Handles callback for repeat check
//
function LeechBlock_repeatCheckBlock() {
 	//LeechBlock_printConsole("LeechBlock_repeatCheckBlock");
	//LeechBlock_printConsole("TempAllow = " + TempAllow);

	var win = arguments[0];
	var lastURL = arguments[1];
	var doc = win.document;

	win.lbRepeatCheckPending = undefined;

	try {
		// Get URL for this page
		var pageURL = LeechBlock_trimURL(win.location.href);

		// Check again only if location has not changed
		if (pageURL == lastURL) {
			// Force update of time spent on this page
			if (doc.lbFocusTime != undefined) {
				// Page is open and has focus
				LeechBlock_clockPageTime(doc, false, false);
				LeechBlock_clockPageTime(doc, true, true);
			} else {
				// Page is open but does not have focus
				LeechBlock_clockPageTime(doc, false, false);
				LeechBlock_clockPageTime(doc, true, false);
			}

			LeechBlock_checkBlock(pageURL, win, true);

			// If page has focus, update time left
			if (doc.lbFocusTime != undefined) {
				LeechBlock_updateTimeLeft(win.lbSecsLeft);
			}
		}
	} catch (e) {
		// Die gracefully
	}
}

// Handles page unloading
//
function LeechBlock_onPageUnload(event) {
	//LeechBlock_printConsole("doc.unload: " + event.target.location + " " + event.target);

	var doc = event.target.ownerDocument != null
			? event.target.ownerDocument
			: event.target;

	LeechBlock_clockPageTime(doc, false, false);
}

// Handles page gaining focus
//
function LeechBlock_onPageFocus(event) {
	//LeechBlock_printConsole("doc.focus: " + event.target.location + " " + event.target);

	var doc = event.target.ownerDocument != null
			? event.target.ownerDocument
			: event.target;

	LeechBlock_clockPageTime(doc, true, true);
}

// Handles page losing focus
//
function LeechBlock_onPageBlur(event) {
	//LeechBlock_printConsole("doc.blur: " + event.target.location + " " + event.target);

	var doc = event.target.ownerDocument != null
			? event.target.ownerDocument
			: event.target;

	LeechBlock_clockPageTime(doc, true, false);
}

// Handles window gaining focus
//
function LeechBlock_onWinFocus(event) {
	//LeechBlock_printConsole("win.focus: " + event.target.location + " " + event.target);

	var win = event.target;
	var doc = win.document;

	if (doc != null) {
		LeechBlock_clockPageTime(doc, true, true);
	}
}

// Handles window losing focus
//
function LeechBlock_onWinBlur(event) {
	//LeechBlock_printConsole("win.blur: " + event.target.location + " " + event.target);

	var win = event.target;
	var doc = win.document;

	if (doc != null) {
		LeechBlock_clockPageTime(doc, true, false);
	}
}

// Clocks time spent on page
//
function LeechBlock_clockPageTime(doc, open, focus) {
	// Clock time during which page has been open
	var secsOpen = 0;
	if (open) {
		if (doc.lbOpenTime == undefined) {
			// Set start time for this page
			doc.lbOpenTime = Date.now();
		}
	} else {
		if (doc.lbOpenTime != undefined) {
			if (doc.location != null && /^(http|file)/.test(doc.location.href)) {
				// Calculate seconds spent on this page (while open)
				secsOpen = Math.round((Date.now() - doc.lbOpenTime) / 1000);
			}

			doc.lbOpenTime = undefined;
		}
	}

	// Clock time during which page has been focused
	var secsFocus = 0;
	if (focus) {
		if (doc.lbFocusTime == undefined) {
			// Set focus time for this page
			doc.lbFocusTime = Date.now();
		}
	} else {
		if (doc.lbFocusTime != undefined) {
			if (doc.location != null && /^(http|file)/.test(doc.location.href)) {
				// Calculate seconds spent on this page (while focused)
				secsFocus = Math.round((Date.now() - doc.lbFocusTime) / 1000);
			}

			doc.lbFocusTime = undefined;
		}
	}

	// Update time data if necessary
	if (secsOpen > 0 || secsFocus > 0) {
		var pageURL = LeechBlock_trimURL(doc.location.href);
		LeechBlock_updateTimeData(pageURL, secsOpen, secsFocus);
	}
}

// Updates data for time spent on page
//
function LeechBlock_updateTimeData(pageURL, secsOpen, secsFocus) {
	//LeechBlock_printConsole("updateTimeData: pageURL = " + pageURL);
	//LeechBlock_printConsole("updateTimeData: secsOpen = " + secsOpen);
	//LeechBlock_printConsole("updateTimeData: secsFocus = " + secsFocus);

	// Get current time/date
	var timedate = new Date();

	// Get current time in seconds
	var now = Math.floor(Date.now() / 1000);

	for (var set = 1; set <= 6; set++) {
		// Get regular expressions for matching sites to block/allow
		var blockRE = LeechBlock_getCharPref("blockRE" + set);
		if (blockRE == "") continue; // no block for this set
		var allowRE = LeechBlock_getCharPref("allowRE" + set);

		// Test URL against block/allow regular expressions
		if (LeechBlock_testURL(pageURL, blockRE, allowRE)) {
			// Get preferences for this set
			var timedata = LeechBlock_getCharPref("timedata" + set).split(",");
			var countFocus = LeechBlock_getBoolPref("countFocus" + set);
			var times = LeechBlock_getCharPref("times" + set);
			var minPeriods = LeechBlock_getMinPeriods(times);
			var limitPeriod = LeechBlock_getCharPref("limitPeriod" + set);
			var conjMode = LeechBlock_getBoolPref("conjMode" + set);
			var daySel = LeechBlock_decodeDays(LeechBlock_getIntPref("days" + set));

			// Get start of this time period
			var periodStart = LeechBlock_getTimePeriodStart(now, limitPeriod);

			// Reset time data if currently invalid
			if (timedata.length != 5) {
				timedata = [now, 0, 0, 0, 0];
			}

			// Get number of seconds spent on page (focused or open)
			var seconds = countFocus ? secsFocus : secsOpen;

			// Update data for total time spent
			timedata[1] = +timedata[1] + seconds;

			// Determine whether we should count time spent on page in
			// specified time period (we should only count time on selected
			// days -- and in conjunction mode, only within time periods)
			var countTimeSpentInPeriod = daySel[timedate.getDay()];
			if (countTimeSpentInPeriod && conjMode) {
				countTimeSpentInPeriod = false;

				// Get number of minutes elapsed since midnight
				var mins = timedate.getHours() * 60 + timedate.getMinutes();

				// Check each time period in turn
				for (var i in minPeriods) {
					if (mins >= minPeriods[i].start
							&& mins < minPeriods[i].end) {
						countTimeSpentInPeriod = true;
					}
				}
			}

			// Update data for time spent in specified time period
			if (countTimeSpentInPeriod && periodStart > 0 && timedata[2] >= 0) {
				if (timedata[2] != periodStart) {
					// We've entered a new time period, so start new count
					timedata[2] = periodStart;
					timedata[3] = seconds;
				} else {
					// We haven't entered a new time period, so keep counting
					timedata[3] = +timedata[3] + seconds;
				}
				//LeechBlock_printConsole("Set " + set + ": " + timedata[3] + "s since " + new Date(timedata[2] * 1000).toLocaleString());
			}

			// Update preferences
			LeechBlock_setCharPref("timedata" + set, timedata.join(","));
		}
	}
}

// Updates time left in status bar
//
function LeechBlock_updateTimeLeft(secsLeft) {
	var element = document.getElementById("lb-time-left");

	if (!LeechBlock_getBoolPref("stl")
			|| secsLeft == undefined || secsLeft == Infinity) {
		element.hidden = true;
	} else {
		element.label = LeechBlock_formatTime(secsLeft);
		element.hidden = false;
	}
}

// Opens options dialog
//
function LeechBlock_openOptionsDialog() {
	window.openDialog("chrome://leechblock/content/options.xul",
			"lb-options", "chrome,centerscreen");
}

// Opens statistics dialog
//
function LeechBlock_openStatsDialog() {
	window.openDialog("chrome://leechblock/content/stats.xul",
			"lb-stats", "chrome,centerscreen");
}

// Opens lockdown dialog
//
function LeechBlock_openLockdownDialog() {
	window.openDialog("chrome://leechblock/content/lockdown.xul",
			"lb-lockdown", "chrome,centerscreen");
}

// Prepares context menu (blacklist)
//
function LeechBlock_prepareContextMenuBlacklist() {
	// Get submenu element
	var menupopup = document.getElementById("lb-context-menupopup-block");

	// Remove all menu items before separator
	while (menupopup.firstChild.nodeName != "menuseparator") {
		menupopup.removeChild(menupopup.firstChild);
	}

	// Get separator element
	var menuseparator = menupopup.firstChild;

	// Add new menu items
	for (var set = 1; set <= 6; set++) {
		// Get custom block set name (if specified)
		var setName = LeechBlock_getCharPref("setName" + set);

		// Create new menu item (add to blacklist)
		var menuitem = document.createElementNS(
				"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
				"menuitem");
		menuitem.setAttribute("id", "lb-context-menuitem-blocksite" + set);
		menuitem.setAttribute("label",
				LeechBlock_getBlockSiteMenuItemLabel(set, setName));
		menuitem.set = set;

		// Add menu item before separator
		menupopup.insertBefore(menuitem, menuseparator);
	}
}

// Prepares context menu (whitelist)
//
function LeechBlock_prepareContextMenuWhitelist() {
	// Get submenu element
	var menupopup = document.getElementById("lb-context-menupopup-allow");

	// Remove all menu items before separator
	while (menupopup.firstChild.nodeName != "menuseparator") {
		menupopup.removeChild(menupopup.firstChild);
	}

	// Get separator element
	var menuseparator = menupopup.firstChild;

	// Add new menu items
	for (var set = 1; set <= 6; set++) {
		// Get custom block set name (if specified)
		var setName = LeechBlock_getCharPref("setName" + set);
    
		// Create new menu item (add to whitelist)
		var menuitem = document.createElementNS(
				"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
				"menuitem");
		menuitem.setAttribute("id", "lb-context-menuitem-allowsite" + set);
		menuitem.setAttribute("label",
				LeechBlock_getAllowSiteMenuItemLabel(set, setName));
		menuitem.set = set;

		// Add menu item before separator
		menupopup.insertBefore(menuitem, menuseparator);
	}
}

// Adds site to block set
//
function LeechBlock_addSiteToSet(win, set, whitelist) {
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	consoleService.logStringMessage('Hello world');
	dump('Hello world')
	if (!set) {
		return;
	}

	// Get URL for this page
	var pageURL = LeechBlock_trimURL(win.location.href);

	LeechBlock_printConsole("LeechBlock_addSiteToSet : pageURL = " + pageURL);

	// Quick exit for non-http/non-file URLs
	if (!/^(http|file)/.test(pageURL)) {
		return;
	}

	// Get site name from URL
	var regexp = /^\w+:\/+(\w+(:\w+)?@)?([^\/]+)/;
	var results = regexp.exec(pageURL);
	var site = results[3];

	// Get sites for this set
	var sites = LeechBlock_getCharPref("sites" + set);

	// Add site if not already included
	var patterns = sites.split(/\s+/);
	if (patterns.indexOf(site) < 0) {
		consoleService.logStringMessage(site);

    if (whitelist) {
        if (sites == "") {
          sites = "+" + site;
        } else {
          sites += " +" + site;
        }
      }
    else {
        if (sites == "") {
          sites = site;
        } else {
          sites += " " + site;
        }
      }

		// Get regular expressions to match sites
		var regexps = LeechBlock_getRegExpSites(sites);

		// Update preferences
		LeechBlock_setCharPref("sites" + set, sites);
		LeechBlock_setCharPref("blockRE" + set, regexps.block);
		LeechBlock_setCharPref("allowRE" + set, regexps.allow);

		LeechBlock_checkBlock(pageURL, win, false);
	}
}

// Add listeners for browser loading/unloading and page loading
window.addEventListener("load", LeechBlock_onLoad, false);
window.addEventListener("unload", LeechBlock_onUnload, false);
window.addEventListener("DOMContentLoaded", LeechBlock_onPageLoad, false);
