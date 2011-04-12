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
 * This file contains the code for modifications to the Extensions Manager.
 */

const LeechBlock_ID = "urn:mozilla:item:{a95d8332-e4b4-6e7f-98ac-20b733364387}";

var LeechBlock_extensionsView = null;
var LeechBlock_ddb = false;
var LeechBlock_dub = false;

// Determines whether LeechBlock extension is selected
//
function LeechBlock_isSelected() {
	return LeechBlock_extensionsView != null
			&& LeechBlock_extensionsView.getAttribute("last-selected") == LeechBlock_ID;
}

// Disables buttons
//
function LeechBlock_disableButtons() {
	if (LeechBlock_isSelected()) {
		var element = document.getElementById(LeechBlock_ID);
		var failed = false;

		if (LeechBlock_ddb) {
			// Try to disable 'Disable' button
			var button = document.getAnonymousElementByAttribute(
					element, "command", "cmd_disable");
			if (button != null) {
				button.setAttribute("disabled", true);
			} else {
				failed = true;
			}
		}

		if (LeechBlock_dub) {
			// Try to disable 'Uninstall' button
			var button = document.getAnonymousElementByAttribute(
					element, "command", "cmd_uninstall");
			if (button != null) {
				button.setAttribute("disabled", true);
			} else {
				failed = true;
			}
		}

		if (failed) {
			// Keep trying until button exists (or window closed)
			window.setTimeout(LeechBlock_disableButtons, 50);
		}
	}
}

// Disables menu items
//
function LeechBlock_disableMenuItems(menu) {
	if (LeechBlock_isSelected()) {
		// Disable menu items as appropriate
		for (var item = menu.firstChild; item != null; item = item.nextSibling) {
			var command = item.getAttribute("command");
			if (LeechBlock_ddb && command == "cmd_disable") {
				item.setAttribute("disabled", true);
			}
			if (LeechBlock_dub && command == "cmd_uninstall") {
				item.setAttribute("disabled", true);
			}
		}
	}
}

// Handles events where extensions list is displayed
//
function LeechBlock_onExtensionsView() {
	// Get preferences
	LeechBlock_ddb = LeechBlock_getBoolPref("ddb");
	LeechBlock_dub = LeechBlock_getBoolPref("dub");

	LeechBlock_extensionsView = document.getElementById("extensionsView");

	// Add event listener to selection list
	LeechBlock_extensionsView.addEventListener(
			"select", LeechBlock_onExtensionSelect, false);

	// Add event listener to Extensions radio button
	document.getElementById("extensions-view").addEventListener(
			"command", LeechBlock_onExtensionsView, false);

	// Add event listener to context menu
	document.getElementById("addonContextMenu").addEventListener(
			"popupshown", LeechBlock_onContextMenu, false);

	LeechBlock_disableButtons();
}

// Handles event where command is triggered
//
function LeechBlock_onCommand(event) {
	if (event.target.localName == "notification") {
		LeechBlock_disableButtons();
	}
}

// Handles event where extension is selected
//
function LeechBlock_onExtensionSelect(event) {
	LeechBlock_disableButtons();
}

// Handles event where context menu is displayed
//
function LeechBlock_onContextMenu(event) {
	LeechBlock_disableMenuItems(event.target);
}

window.addEventListener("load", LeechBlock_onExtensionsView, false);
window.addEventListener("command", LeechBlock_onCommand, false);
